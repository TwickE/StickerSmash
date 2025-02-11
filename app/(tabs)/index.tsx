import { View, StyleSheet, Platform } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import IconButton from "@/components/IconButton";
import CircleButton from "@/components/CircleButton";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiList from "@/components/EmojiList";
import { ImageSource } from "expo-image";
import EmojiSticker from "@/components/EmojiSticker";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import domtoimage from "dom-to-image";

const PlaceholderImage = require("../../assets/images/background-image.png")

export default function Index() {
    const imageRef = useRef(null);
    const [premissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
    const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [pickedEmoji, setPickedEmoji] = useState<ImageSource | undefined>(undefined);

    useEffect(() => {
        if (!premissionResponse?.granted) {
            requestPermission();
        }
    }, []);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            aspect: [32, 44],
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
            setShowAppOptions(true);
            console.log(result);
        } else {
            alert("Image picker was cancelled");
        }
    };

    const onReset = () => {
        setShowAppOptions(false);
    };

    const onModalClose = () => {
        setIsModalVisible(false);
    };

    const onAddSticker = () => {
        setIsModalVisible(true);
    };

    const onSaveImageAsync = async () => {
        if (Platform.OS === 'web') {
            try {
                if (imageRef.current) {
                    const dataUrl = await domtoimage.toJpeg(imageRef.current, {
                        quality: 1,
                        width: 320,
                        height: 440,
                    });
                    const link = document.createElement('a');
                    link.download = 'sticker-smash.jpeg';
                    link.href = dataUrl;
                    link.click();
                    alert('Image saved to downloads!');
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const localUri = await captureRef(imageRef, {
                    height: 440,
                    quality: 1,
                });

                await MediaLibrary.saveToLibraryAsync(localUri);
                if (localUri) {
                    alert('Image saved to the gallery!');
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View ref={imageRef} collapsable={false}>
                <ImageViewer imgSource={selectedImage || PlaceholderImage} />
                {pickedEmoji && (
                    <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
                )}
            </View>
            {showAppOptions ? (
                <View>
                    <View style={styles.optionsRow}>
                        <IconButton icon="refresh" label="Reset" onPress={onReset} />
                        <CircleButton onPress={onAddSticker} />
                        <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
                    </View>
                </View>
            ) : (
                <View style={styles.footerContainer}>
                    <Button label="Choose a photo" theme="primary" onPress={pickImageAsync} />
                    <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
                </View>
            )}
            <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
                <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
            </EmojiPicker>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "#25292e",
    },
    imageContainer: {
        flex: 1,
    },
    footerContainer: {
        flex: 1 / 3,
        alignItems: "center",
    },
    optionsRow: {
        alignItems: "center",
        flexDirection: "row",
    },
});