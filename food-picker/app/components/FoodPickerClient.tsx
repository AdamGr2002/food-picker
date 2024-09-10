/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Search, ChevronDown, ChevronUp, Share2, Info } from 'lucide-react'
import { useSwipeable } from 'react-swipeable'
import Confetti from 'react-confetti'
import { useRouter } from 'next/navigation'
import { FoodItem, Category, searchMeals, getNutritionInfo, NutritionInfo } from '../api'
import { FlavorProfile } from './FlavorProfileQuiz'

type FoodPickerClientProps = {
  foodItems: FoodItem[]
  setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>
  currentIndex: number
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
  likedMeals: FoodItem[]
  setLikedMeals: React.Dispatch<React.SetStateAction<FoodItem[]>>
  nutritionInfo: NutritionInfo | null
  setNutritionInfo: React.Dispatch<React.SetStateAction<NutritionInfo | null>>
  categories: Category[]
  mealOfTheDay: FoodItem
  flavorProfile: FlavorProfile | null
}

export default function FoodPickerClient({
  foodItems,
  setFoodItems,
  currentIndex,
  setCurrentIndex,
  likedMeals,
  setLikedMeals,
  nutritionInfo,
  setNutritionInfo,
  categories,
  mealOfTheDay,
  flavorProfile
}: FoodPickerClientProps) {
  const [direction, setDirection] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [streak, setStreak] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showNutritionInfo, setShowNutritionInfo] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const currentFood = foodItems[currentIndex]

  useEffect(() => {
    if (isClient) {
      filterFoodItems()
    }
  }, [searchQuery, selectedCategory, flavorProfile, isClient])

  useEffect(() => {
    if (isClient && currentFood) {
      fetchNutritionInfo(currentFood.title)
    }
  }, [currentFood, isClient])

  const filterFoodItems = async () => {
    let filteredItems = foodItems

    if (searchQuery) {
      filteredItems = await searchMeals(searchQuery)
    }

    if (selectedCategory) {
      filteredItems = filteredItems.filter(item => item.category === selectedCategory)
    }

    if (flavorProfile) {
      filteredItems = filteredItems.filter(item => {
        if (flavorProfile.spicy && !item.ingredients.some(ing => ing.toLowerCase().includes('spicy') || ing.toLowerCase().includes('pepper'))) return false
        if (flavorProfile.sweet && !item.ingredients.some(ing => ing.toLowerCase().includes('sugar') || ing.toLowerCase().includes('syrup'))) return false
        if (flavorProfile.savory && !item.ingredients.some(ing => ing.toLowerCase().includes('salt') || ing.toLowerCase().includes('broth'))) return false
        if (flavorProfile.exotic && !['Chinese', 'Indian', 'Thai', 'Japanese', 'Mexican'].includes(item.area)) return false
        if (flavorProfile.vegetarian && item.ingredients.some(ing => ing.toLowerCase().includes('meat') || ing.toLowerCase().includes('chicken') || ing.toLowerCase().includes('beef'))) return false
        return true
      })
    }

    setFoodItems(filteredItems)
    setCurrentIndex(0)
  }

  const fetchNutritionInfo = async (foodName: string) => {
    const info = await getNutritionInfo(foodName)
    setNutritionInfo(info)
  }

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    setDirection(swipeDirection)
    setTimeout(() => {
      if (swipeDirection === 'right') {
        setLikedMeals(prev => [...prev, currentFood])
        setStreak(prev => prev + 1)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      } else {
        setStreak(0)
      }
      setCurrentIndex((prevIndex) => (prevIndex + 1) % foodItems.length)
      setDirection(null)
    }, 300)
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventScrollOnSwipe: true,
    trackMouse: true
  })

  const handleShare = () => {
    const shareText = `Check out this delicious ${currentFood.title} recipe I found on Food Picker!`
    const shareUrl = `https://www.themealdb.com/meal/${currentFood.id}`
    
    if (navigator.share) {
      navigator.share({
        title: currentFood.title,
        text: shareText,
        url: shareUrl,
      })
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
    }
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="mb-4 p-4 bg-yellow-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Meal of the Day Challenge</h3>
        <p>Try making: <strong>{mealOfTheDay.title}</strong></p>
      </div>
      <div className="relative w-full h-96" {...swipeHandlers}>
        <AnimatePresence>
          {currentFood && (
            <motion.div
              key={currentFood.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
                opacity: 0,
              }}
              transition={{ duration: 0.3 }}
              className="absolute w-full h-full"
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={currentFood.image}
                  alt={currentFood.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h2 className="text-white text-2xl font-semibold">{currentFood.title}</h2>
                  <p className="text-white">{currentFood.category} - {currentFood.area}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={() => handleSwipe('left')}
          className="p-4 bg-red-500 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors"
          aria-label="Dislike"
        >
          <X size={24} />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="p-4 bg-green-500 rounded-full text-white shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Like"
        >
          <Heart size={24} />
        </button>
        <button
          onClick={handleShare}
          className="p-4 bg-blue-500 rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors"
          aria-label="Share"
        >
          <Share2 size={24} />
        </button>
        <button
          onClick={() => setShowNutritionInfo(!showNutritionInfo)}
          className="p-4 bg-purple-500 rounded-full text-white shadow-lg hover:bg-purple-600 transition-colors"
          aria-label="Nutrition Info"
        >
          <Info size={24} />
        </button>
      </div>
      <div className="mt-4 text-center">
        <p className="text-xl font-bold">Meal Streak: {streak}</p>
      </div>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {showDetails ? 'Hide' : 'Show'} Details
        {showDetails ? <ChevronUp className="inline ml-2" /> : <ChevronDown className="inline ml-2" />}
      </button>
      {showDetails && currentFood && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
          <ul className="list-disc pl-5 mb-4">
            {currentFood.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
          <p>{currentFood.instructions}</p>
        </div>
      )}
      {showNutritionInfo && nutritionInfo && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Nutrition Information (per 100g):</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Calories: {nutritionInfo.calories.toFixed(2)} kcal</li>
            <li>Fat: {nutritionInfo.fat.toFixed(2)}g</li>
            <li>Carbs: {nutritionInfo.carbs.toFixed(2)}g</li>
            <li>Protein: {nutritionInfo.protein.toFixed(2)}g</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">Ingredients (from Open Food Facts):</h3>
          <ul className="list-disc pl-5 mb-4">
            {nutritionInfo.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Liked Meals</h3>
        <div className="grid grid-cols-2 gap-4">
          {likedMeals.map((meal) => (
            <div key={meal.id} className="bg-white rounded shadow p-2">
              <img src={meal.image} alt={meal.title} className="w-full h-32 object-cover rounded" />
              <p className="mt-2 text-center font-medium">{meal.title}</p>
            </div>
          ))}
        </div>
      </div>
      {showConfetti && <Confetti />}
    </div>
  )
}