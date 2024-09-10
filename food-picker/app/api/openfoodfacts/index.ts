import { cache } from 'react'
import { NutritionInfo } from './types'

export const getNutritionInfo = cache(async (productName: string): Promise<NutritionInfo | null> => {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(productName)}&search_simple=1&action=process&json=1`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition info')
    }

    const data = await response.json()

    if (data.products && data.products.length > 0) {
      const product = data.products[0]
      return {
        calories: parseFloat(product.nutriments['energy-kcal_100g'] || '0'),
        fat: parseFloat(product.nutriments.fat_100g || '0'),
        carbs: parseFloat(product.nutriments.carbohydrates_100g || '0'),
        protein: parseFloat(product.nutriments.proteins_100g || '0'),
        ingredients: product.ingredients_text_en ? product.ingredients_text_en.split(',').map((i: string) => i.trim()) : [],
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching nutrition info:', error)
    return null
  }
})