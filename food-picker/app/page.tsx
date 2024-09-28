import { Suspense } from 'react'
import { getFoodItems, getCategories, getMealOfTheDay } from './api'
import { Loader2 } from 'lucide-react'
import FoodPickerWrapper from './components/FoodPickerWrapper'
import Link from 'next/link'

export default async function Home() {
  try {
    const [foodItems, categories, mealOfTheDay] = await Promise.all([
      getFoodItems(),
      getCategories(),
      getMealOfTheDay()
    ])

    console.log('Fetched Food Items:', foodItems)
    console.log('Fetched Categories:', categories)
    console.log('Fetched Meal of the Day:', mealOfTheDay)

    if (!foodItems.length) {
      throw new Error('No food items fetched')
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <nav className="mb-8">
          <Link href="/sign-in" className="mr-4 text-primary hover:underline">Sign In</Link>
          <Link href="/sign-up" className="text-primary hover:underline">Sign Up</Link>
        </nav>
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Food Picker</h1>
        <Suspense fallback={<Loader2 className="animate-spin text-primary" size={48} />}>
          <FoodPickerWrapper
            initialFoodItems={foodItems}
            categories={categories}
            mealOfTheDay={mealOfTheDay}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('Error in Home component:', error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading data</h1>
        <p className="text-gray-700 dark:text-gray-300">Please try again later or contact support if the problem persists.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{(error as Error).message}</p>
      </div>
    )
  }
}