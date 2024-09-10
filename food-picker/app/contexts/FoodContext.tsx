/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FoodItem, Category, NutritionInfo } from '../api'

type FoodContextType = {
  foodItems: FoodItem[]
  setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  likedMeals: FoodItem[]
  setLikedMeals: React.Dispatch<React.SetStateAction<FoodItem[]>>
  nutritionInfo: NutritionInfo | null
  setNutritionInfo: React.Dispatch<React.SetStateAction<NutritionInfo | null>>
}

const FoodContext = createContext<FoodContextType | undefined>(undefined)

export function FoodProvider({ children, initialFoodItems }: { children: ReactNode, initialFoodItems: FoodItem[] }) {
  const [foodItems, setFoodItems] = useState(initialFoodItems)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedMeals, setLikedMeals] = useState<FoodItem[]>([])
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(null)

  return (
    <FoodContext.Provider value={{
      foodItems,
      setFoodItems,
      currentIndex,
      setCurrentIndex,
      likedMeals,
      setLikedMeals,
      nutritionInfo,
      setNutritionInfo
    }}>
      {children}
    </FoodContext.Provider>
  )
}

export function useFoodContext() {
  const context = useContext(FoodContext)
  if (context === undefined) {
    throw new Error('useFoodContext must be used within a FoodProvider')
  }
  return context
}