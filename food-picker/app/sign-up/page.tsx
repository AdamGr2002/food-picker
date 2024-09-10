'use client'

import { useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { ChefHat } from 'lucide-react'

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <ChefHat className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-800">Join FoodPicker</h1>
        <p className="text-xl text-gray-600 mt-2">Create an account to start your culinary journey!</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onAnimationComplete={() => setMounted(true)}
        className="w-full max-w-md"
      >
        {mounted && (
          <SignUp
            appearance={{
              elements: {
                card: 'bg-white shadow-xl rounded-xl',
                headerTitle: 'text-2xl font-bold text-gray-800',
                headerSubtitle: 'text-gray-600',
                formButtonPrimary: 'bg-green-500 hover:bg-green-600 text-white',
                formFieldInput: 'border-gray-300 focus:ring-green-500 focus:border-green-500',
                footerAction: 'text-green-600 hover:text-green-700',
              },
            }}
          />
        )}
      </motion.div>
    </div>
  )
}