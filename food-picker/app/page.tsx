import { Suspense } from 'react'
import { getFoodItems, getCategories, getMealOfTheDay } from './api'
import { Loader2 } from 'lucide-react'
import FoodPickerWrapper from './components/FoodPickerWrapper'

export default async function Home() {
  const [foodItems, categories, mealOfTheDay] = await Promise.all([
    getFoodItems(),
    getCategories(),
    getMealOfTheDay()
  ])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Food Picker</h1>
      <Suspense fallback={<Loader2 className="animate-spin" size={48} />}>
        <FoodPickerWrapper
          initialFoodItems={foodItems}
          categories={categories}
          mealOfTheDay={mealOfTheDay}
        />
      </Suspense>
    </div>
  )
}