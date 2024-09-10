'use client'

import { useState } from 'react'
import { FoodItem, Category, NutritionInfo } from '../api'
import FoodPickerClient from './FoodPickerClient'
import FlavorProfileQuiz, { FlavorProfile } from './FlavorProfileQuiz'

type FoodPickerWrapperProps = {
  initialFoodItems: FoodItem[]
  categories: Category[]
  mealOfTheDay: FoodItem
}

export default function FoodPickerWrapper({ initialFoodItems, categories, mealOfTheDay }: FoodPickerWrapperProps) {
  const [foodItems, setFoodItems] = useState(initialFoodItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedMeals, setLikedMeals] = useState<FoodItem[]>([])
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null)
  const [flavorProfile, setFlavorProfile] = useState<FlavorProfile | null>(null)
  const [showQuiz, setShowQuiz] = useState(true)

  const handleQuizComplete = (profile: FlavorProfile) => {
    setFlavorProfile(profile)
    setShowQuiz(false)
  }

  if (showQuiz) {
    return <FlavorProfileQuiz onComplete={handleQuizComplete} />
  }

  return (
    <FoodPickerClient
      foodItems={foodItems}
      setFoodItems={setFoodItems}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      likedMeals={likedMeals}
      setLikedMeals={setLikedMeals}
      nutritionInfo={nutritionInfo}
      setNutritionInfo={setNutritionInfo}
      categories={categories}
      mealOfTheDay={mealOfTheDay}
      flavorProfile={flavorProfile}
    />
  )
}