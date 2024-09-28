'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

interface ClerkProviderWithChildrenProps {
  children: ReactNode
}

export default function ClerkProviderWithChildren({ children }: ClerkProviderWithChildrenProps) {
  return <ClerkProvider>{children}</ClerkProvider>
}