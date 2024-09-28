'use client'

import { useState } from 'react'

export type FlavorProfile = {
  spicy: boolean
  sweet: boolean
  savory: boolean
  exotic: boolean
  vegetarian: boolean
}

type FlavorProfileQuizProps = {
  onComplete: (profile: FlavorProfile) => void
}

export default function FlavorProfileQuiz({ onComplete }: FlavorProfileQuizProps) {
  const [profile, setProfile] = useState<FlavorProfile>({
    spicy: false,
    sweet: false,
    savory: false,
    exotic: false,
    vegetarian: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(profile)
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Flavor Profile Quiz</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(profile).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name={key}
                checked={value}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="capitalize">{key}</span>
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Complete Quiz
        </button>
      </form>
    </div>
  )
}