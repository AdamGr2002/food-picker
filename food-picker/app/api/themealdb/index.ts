/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { cache } from 'react'
import { FoodItem, Category } from './types'

const fetchWithRetry = async (url: string, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { 
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retrying
    }
  }
}

export async function getFoodItems(page: number = 1, limit: number = 20): Promise<FoodItem[]> {
  try {
    const meals: FoodItem[] = []
    let attempts = 0
    while (meals.length < limit && attempts < 5) {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
      const data = await response.json()
      
      if (data.meals && data.meals[0]) {
        const meal = data.meals[0]
        const foodItem: FoodItem = {
          id: meal.idMeal,
          title: meal.strMeal,
          category: meal.strCategory,
          area: meal.strArea,
          instructions: meal.strInstructions,
          image: meal.strMealThumb,
          ingredients: getIngredients(meal),
        }
        if (!meals.some(existingMeal => existingMeal.id === foodItem.id)) {
          meals.push(foodItem)
        }
      }
      attempts++
    }
    return meals
  } catch (error) {
    console.error('Error fetching food items:', error)
    return []
  }
}

function getIngredients(meal: any): string[] {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`)
    }
  }
  return ingredients
}

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