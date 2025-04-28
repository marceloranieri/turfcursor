// lib/auth/authEffects.ts

import { toast } from 'react-hot-toast'
import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'

export function useConfetti() {
  const [isPlaying, setIsPlaying] = useState(false)

  const play = useCallback(() => {
    if (isPlaying) return
    setIsPlaying(true)
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    setTimeout(() => setIsPlaying(false), 2000)
  }, [isPlaying])

  // We don't actually need a component since we're using canvas-confetti
  // Just return null as the component to maintain API compatibility
  const ConfettiComponent = () => null

  return { play, ConfettiComponent }
}

export function handleAuthSuccess(type: 'signin' | 'signup' | 'reset') {
  trackLoginCount()
  
  const messages = {
    signin: 'Welcome back! 👋',
    signup: 'Welcome to Turf! 🌱',
    reset: 'Password reset successful! 🔐'
  }
  
  toast.success(messages[type])
}

export function trackLoginCount() {
  const count = localStorage.getItem('turf-login-count')
  const newCount = count ? parseInt(count, 10) + 1 : 1
  localStorage.setItem('turf-login-count', String(newCount))

  if (newCount === 5) {
    toast("You're on a roll! 🛹 5 logins in a row!", {
      icon: '🔥',
      duration: 4000
    })
  }
}
