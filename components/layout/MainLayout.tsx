'use client'

import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  enableDebug?: boolean
}

const MainLayout = ({ children, enableDebug = false }: MainLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>{children}</body>
    </html>
  )
}

export default MainLayout;
