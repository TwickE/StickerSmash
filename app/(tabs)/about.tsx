import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        This Project was made by{'\n'}
        <Text style={styles.textBold}>Frederico Silva</Text>
        {'\n'} following a Expo tutorial</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 20,
    padding: 60,
    textAlign: 'center',
  },
  textBold: {
    fontWeight: 'bold',
  }
});
