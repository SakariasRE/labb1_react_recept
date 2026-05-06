import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/home'
import AddRecipePage from './pages/add'
import RecipeDetailsPage from './pages/details'
import type { Recipe } from './types/Recipe'
import './index.css'

function App() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    async function fetchRecipes() {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch('https://dummyjson.com/recipes')
            if (!response.ok) throw new Error('Failed to fetch recipes')

            const data = await response.json()
            setRecipes(data.recipes)
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
        try {
            if (editingRecipe) {
                const response = await fetch(
                    `https://dummyjson.com/recipes/${recipe.id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(recipe)
                    }
                )
                if (!response.ok) throw new Error('Failed to update recipe')

                const updatedRecipes = recipes.map((currentRecipe) =>
                    currentRecipe.id === recipe.id ? recipe : currentRecipe
                )

                setRecipes(updatedRecipes)
                setEditingRecipe(null)
                navigate('/')
            } else {
                const response = await fetch(
                    'https://dummyjson.com/recipes/add',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(recipe)
                    }
                )
                if (!response.ok) throw new Error('Failed to add recipe')

                const createdRecipe = await response.json()

                const newRecipe: Recipe = {
                    ...createdRecipe,
                    id: Date.now(),
                    name: recipe.name,
                    ingredients: recipe.ingredients,
                    difficulty: recipe.difficulty,
                    image: recipe.image
                }

                setRecipes([newRecipe, ...recipes])
                navigate('/')
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Failed to save recipe'
            setError(message)
            console.error(error)
        }
    }

    async function handleRecipeDelete(recipeId: number) {
        setError(null)
        try {
            const response = await fetch(
                `https://dummyjson.com/recipes/${recipeId}`,
                {
                    method: 'DELETE'
                }
            )
            if (!response.ok) throw new Error('Failed to delete recipe')

            const filteredRecipes = recipes.filter(
                (recipe) => recipe.id !== recipeId
            )

            setRecipes(filteredRecipes)
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
