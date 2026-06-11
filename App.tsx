import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import { GameScreen } from './app/GameScreen'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GameScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50'
  }
})
