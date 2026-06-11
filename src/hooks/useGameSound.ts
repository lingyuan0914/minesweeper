import { useEffect, useRef } from 'react'
import { Audio } from 'expo-av'

type SoundType = 'click' | 'flag' | 'explosion' | 'victory'

export function useGameSound() {
  const sounds = useRef<Partial<Record<SoundType, Audio.Sound>>>({})

  useEffect(() => {
    loadSounds()
    return () => { unloadSounds() }
  }, [])

  const loadSounds = async () => {
    try {
      const { sound: clickSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/click.mp3')
      )
      sounds.current.click = clickSound

      const { sound: flagSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/flag.mp3')
      )
      sounds.current.flag = flagSound

      const { sound: explosionSound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/explosion.mp3')
      )
      sounds.current.explosion = explosionSound

      const { sound: victorySound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/victory.mp3')
      )
      sounds.current.victory = victorySound
    } catch (error) {
      console.log('Error loading sounds:', error)
    }
  }

  const unloadSounds = async () => {
    for (const sound of Object.values(sounds.current)) {
      if (sound) {
        await sound.unloadAsync()
      }
    }
  }

  const playSound = async (type: SoundType) => {
    try {
      const sound = sounds.current[type]
      if (sound) {
        await sound.setPositionAsync(0)
        await sound.playAsync()
      }
    } catch (error) {
      console.log('Error playing sound:', error)
    }
  }

  return { playSound }
}
