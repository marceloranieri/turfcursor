// lib/auth/authEffects.ts

import { toast } from 'react-hot-toast'

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
