'use client'

import { useState } from 'react'
import { SignIn } from '@clerk/nextjs/'
import { motion } from 'framer-motion'
import { Utensils } from 'lucide-react'

export default function SignInPage() {
  const [mounted, setMounted] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <Utensils className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">Welcome to FoodPicker</h1>
        <p className="text-xl text-gray-600 mt-2">Sign in to discover delicious recipes!</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onAnimationComplete={() => setMounted(true)}
        className="w-full max-w-md"
      >
        {mounted && (
          <SignIn
            appearance={{
              elements: {
                card: 'bg-white shadow-xl rounded-xl',
                headerTitle: 'text-2xl font-bold text-gray-800',
                headerSubtitle: 'text-gray-600',
                formButtonPrimary: 'bg-orange-500 hover:bg-orange-600 text-white',
                formFieldInput: 'border-gray-300 focus:ring-orange-500 focus:border-orange-500',
                footerAction: 'text-orange-600 hover:text-orange-700',
              },
            }}
          />
        )}
      </motion.div>
    </div>
  )
}