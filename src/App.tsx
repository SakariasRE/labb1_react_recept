import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/home'
import AddRecipePage from './pages/add'
import RecipeDetailsPage from './pages/details'
import type { Recipe } from './types/Recipe'
import './index.css'

const API_BASE_URL = 'https://dummyjson.com/recipes'
const STORAGE_KEY = 'savedRecipes'

function App() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    function saveRecipesToStorage(items: Recipe[]) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch (error) {
            console.error('Could not save recipes to local storage', error)
        }
    }

    async function fetchRecipes() {
        setLoading(true)
        setError(null)
        try {
            const storedRecipes = localStorage.getItem(STORAGE_KEY)
            if (storedRecipes) {
                setRecipes(JSON.parse(storedRecipes))
                return
            }

            const response = await fetch(API_BASE_URL)
            if (!response.ok) throw new Error('Failed to fetch recipes')

            const data = await response.json()
            setRecipes(data.recipes)
            saveRecipesToStorage(data.recipes)
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch recipes'
            setError(message)
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [])

    async function handleRecipeSubmit(recipe: Recipe) {
        setError(null)

        if (editingRecipe) {
            const updatedRecipes = recipes.map((currentRecipe) =>
                currentRecipe.id === recipe.id ? recipe : currentRecipe
            )
            setRecipes(updatedRecipes)
            saveRecipesToStorage(updatedRecipes)

            try {
                const response = await fetch(`${API_BASE_URL}/${recipe.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(recipe)
                })
                if (!response.ok) throw new Error('Failed to update recipe')

                const responseRecipe = await response.json()
                const mergedRecipes = recipes.map((currentRecipe) =>
                    currentRecipe.id === recipe.id
                        ? { ...currentRecipe, ...responseRecipe }
                        : currentRecipe
                )

                setRecipes(mergedRecipes)
                saveRecipesToStorage(mergedRecipes)
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to update recipe'
                setError(message)
                console.error(error)
            } finally {
                setEditingRecipe(null)
                navigate('/')
            }
        } else {
            const newRecipe: Recipe = {
                ...recipe,
                id: Date.now()
            }
            const addedRecipes = [newRecipe, ...recipes]
            setRecipes(addedRecipes)
            saveRecipesToStorage(addedRecipes)

            try {
                const response = await fetch(`${API_BASE_URL}/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(recipe)
                })
                if (!response.ok) throw new Error('Failed to add recipe')

                const createdRecipe = await response.json()
                const createdRecipeWithId: Recipe = {
                    ...createdRecipe,
                    id: newRecipe.id,
                    name: recipe.name,
                    ingredients: recipe.ingredients,
                    difficulty: recipe.difficulty,
                    image: recipe.image
                }
                const updatedRecipes = [createdRecipeWithId, ...recipes]
                setRecipes(updatedRecipes)
                saveRecipesToStorage(updatedRecipes)
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : 'Failed to add recipe'
                setError(message)
                console.error(error)
            } finally {
                navigate('/')
            }
        }
    }

    async function handleRecipeDelete(recipeId: number) {
        setError(null)
        const filteredRecipes = recipes.filter(
            (recipe) => recipe.id !== recipeId
        )
        setRecipes(filteredRecipes)
        saveRecipesToStorage(filteredRecipes)

        try {
            const response = await fetch(`${API_BASE_URL}/${recipeId}`, {
                method: 'DELETE'
            })
            if (!response.ok) throw new Error('Failed to delete recipe')
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Failed to delete recipe'
            setError(message)
            console.error(error)
        }
    }

    function handleRecipeEdit(recipe: Recipe) {
        setEditingRecipe(recipe)
        navigate('/add')
    }

    return (
        <>
            <Navbar />
            {error && (
                <div className="error-message" role="alert">
                    {error}
                </div>
            )}
            {loading && <div className="loading">Loading...</div>}

            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            recipes={recipes}
                            onDelete={handleRecipeDelete}
                            onEdit={handleRecipeEdit}
                        />
                    }
                />

                <Route
                    path="/add"
                    element={
                        <AddRecipePage
                            onSubmit={handleRecipeSubmit}
                            editingRecipe={editingRecipe}
                        />
                    }
                />

                <Route
                    path="/recipes/:id"
                    element={<RecipeDetailsPage recipes={recipes} />}
                />
            </Routes>
        </>
    )
}

export default App
