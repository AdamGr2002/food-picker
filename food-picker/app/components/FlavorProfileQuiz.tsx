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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [profile, setProfile] = useState<FlavorProfile>({
    spicy: false,
    sweet: false,
    savory: false,
    exotic: false,
    vegetarian: false
  })

  const questions = [
    { question: "Do you prefer spicy food?", key: "spicy" },
    { question: "Do you like sweet flavors?", key: "sweet" },
    { question: "Are you a fan of savory dishes?", key: "savory" },
    { question: "Do you enjoy exotic cuisines?", key: "exotic" },
    { question: "Are you vegetarian or vegan?", key: "vegetarian" }
  ]

  const handleAnswer = (answer: boolean) => {
    const newProfile = { ...profile, [questions[currentQuestion].key]: answer }
    setProfile(newProfile)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onComplete(newProfile)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Flavor Profile Quiz</h2>
      <p className="mb-4">{questions[currentQuestion].question}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => handleAnswer(true)}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={() => handleAnswer(false)}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          No
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  )
}