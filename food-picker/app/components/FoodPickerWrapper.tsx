'use client'

import { useState, useEffect, useCallback } from 'react'
import { FoodItem, Category, NutritionInfo, getFoodItems } from '../api'
import FoodPickerClient from './FoodPickerClient'
import FlavorProfileQuiz, { FlavorProfile } from './FlavorProfileQuiz'

type FoodPickerWrapperProps = {
  initialFoodItems: FoodItem[]
  categories: Category[]
  mealOfTheDay: FoodItem
}

export default function FoodPickerWrapper({ initialFoodItems, categories, mealOfTheDay }: FoodPickerWrapperProps) {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedMeals, setLikedMeals] = useState<FoodItem[]>([])
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null)
  const [flavorProfile, setFlavorProfile] = useState<FlavorProfile | null>(null)
  const [showQuiz, setShowQuiz] = useState(true)
  const [page, setPage] = useState(1)

  const fetchMoreMeals = useCallback(async () => {
    const newMeals = await getFoodItems(page + 1)
    setFoodItems(prevItems => {
      const uniqueNewMeals = newMeals.filter(newMeal => !prevItems.some(item => item.id === newMeal.id))
      return [...prevItems, ...uniqueNewMeals]
    })
    setPage(prevPage => prevPage + 1)
  }, [page])

  useEffect(() => {
    if (currentIndex >= foodItems.length - 5) {
      fetchMoreMeals()
    }
  }, [currentIndex, foodItems.length, fetchMoreMeals])

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
      fetchMoreMeals={fetchMoreMeals}
    />
  )
}