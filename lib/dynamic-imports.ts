'use client'

import dynamic from 'next/dynamic'

export const SignInModal = dynamic(() => import('@/components/auth/SignInModal').then(mod => mod.SignInModal), { ssr: false })
export const ForgotPasswordModal = dynamic(() => import('@/components/auth/ForgotPasswordModal').then(mod => mod.ForgotPasswordModal), { ssr: false })
export const ResetPasswordModal = dynamic(() => import('@/components/auth/ResetPasswordModal').then(mod => mod.ResetPasswordModal), { ssr: false })
export const VerifyEmailModal = dynamic(() => import('@/components/auth/VerifyEmailModal').then(mod => mod.VerifyEmailModal), { ssr: false })
