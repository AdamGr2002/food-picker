'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { useEffect, useState, ReactNode } from 'react'

interface ClerkProviderWithChildrenProps {
  children: ReactNode
}

export default function ClerkProviderWithChildren({ children }: ClerkProviderWithChildrenProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <ClerkProvider>{children}</ClerkProvider>
}