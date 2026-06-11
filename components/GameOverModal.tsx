import React from 'react'
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { useTheme } from './ThemeProvider'

interface GameOverModalProps {
  visible: boolean
  isWin: boolean
  onRestart: () => void
}

export function GameOverModal({ visible, isWin, onRestart }: GameOverModalProps) {
  const { theme } = useTheme()
  const scale = useSharedValue(0)

  React.useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 })
    } else {
      scale.value = 0
    }
  }, [visible])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, animatedStyle, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: isWin ? theme.success : theme.danger }]}>
            {isWin ? '🎉 恭喜你赢了！' : '💥 游戏结束！'}
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {isWin ? '你成功排出了所有地雷' : '踩到地雷了'}
          </Text>
          <Pressable
            style={[styles.button, { backgroundColor: theme.primaryGradient[0] }]}
            onPress={onRestart}
          >
            <Text style={styles.buttonText}>重新开始</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
