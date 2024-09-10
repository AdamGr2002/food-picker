/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cache } from 'react'
import { FoodItem, Category } from './types'

export const getFoodItems = cache(async (): Promise<FoodItem[]> => {
  const response = await fetch(
    'https://www.themealdb.com/api/json/v1/1/random.php',
    { next: { revalidate: 0 } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch food items')
  }

  const data = await response.json()

  const meals = await Promise.all(
    Array.from({ length: 10 }, () => 
      fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(res => res.json())
        .then(data => data.meals[0])
    )
  )

  return meals.map((meal: any) => ({
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    instructions: meal.strInstructions,
    ingredients: Object.keys(meal)
      .filter(key => key.startsWith('strIngredient') && meal[key])
      .map(key => meal[key]),
    area: meal.strArea
  }))
})

export const searchMeals = cache(async (query: string): Promise<FoodItem[]> => {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
    { next: { revalidate: 3600 } }
  )

  if (!response.ok) {
    throw new Error('Failed to search meals')
  }

  const data = await response.json()

  return data.meals ? data.meals.map((meal: any) => ({
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    instructions: meal.strInstructions,
    ingredients: Object.keys(meal)
      .filter(key => key.startsWith('strIngredient') && meal[key])
      .map(key => meal[key]),
    area: meal.strArea
  })) : []
})

export const getCategories = cache(async (): Promise<Category[]> => {
  const response = await fetch(
    'https://www.themealdb.com/api/json/v1/1/list.php?c=list',
    { next: { revalidate: 86400 } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }

  const data = await response.json()

  return data.meals.map((category: any) => category.strCategory)
})

export const getMealOfTheDay = cache(async (): Promise<FoodItem> => {
  const response = await fetch(
    'https://www.themealdb.com/api/json/v1/1/random.php',
    { next: { revalidate: 86400 } }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch meal of the day')
  }

  const data = await response.json()
  const meal = data.meals[0]

  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    instructions: meal.strInstructions,
    ingredients: Object.keys(meal)
      .filter(key => key.startsWith('strIngredient') && meal[key])
      .map(key => meal[key]),
    area: meal.strArea
  }
})