import { useEffect, useState, type FormEvent } from 'react'
import type { Recipe } from '../types/Recipe'

interface RecipeFormProps {
  onSubmit: (recipe: Recipe) => void
  editingRecipe: Recipe | null
}

function RecipeForm({
  onSubmit,
  editingRecipe,
}: RecipeFormProps) {
  const [recipeName, setRecipeName] = useState('')
  const [recipeIngredients, setRecipeIngredients] = useState('')
  const [recipeDifficulty, setRecipeDifficulty] = useState('')
  const [recipeImage, setRecipeImage] = useState('')

  useEffect(() => {
    if (editingRecipe) {
      setRecipeName(editingRecipe.name)
      setRecipeIngredients(editingRecipe.ingredients.join(', '))
      setRecipeDifficulty(editingRecipe.difficulty)
      setRecipeImage(editingRecipe.image)
    }
  }, [editingRecipe])

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const recipeObject: Recipe = {
      id: editingRecipe ? editingRecipe.id : Date.now(),
      name: recipeName,
      ingredients: recipeIngredients
        .split(',')
        .map((ingredient) => ingredient.trim())
        .filter((ingredient) => ingredient !== ''),
      difficulty: recipeDifficulty,
      image: recipeImage,
    }

    onSubmit(recipeObject)

    setRecipeName('')
    setRecipeIngredients('')
    setRecipeDifficulty('')
    setRecipeImage('')
  }

  return (
    <form onSubmit={handleFormSubmit} className="form">
      <input
        type="text"
        placeholder="Receptnamn"
        value={recipeName}
        onChange={(event) => setRecipeName(event.target.value)}
      />

      <input
        type="text"
        placeholder="Ingredienser, separera med kommatecken"
        value={recipeIngredients}
        onChange={(event) =>
          setRecipeIngredients(event.target.value)
        }
      />

      <input
        type="text"
        placeholder="Svårighet, exempel: Easy"
        value={recipeDifficulty}
        onChange={(event) =>
          setRecipeDifficulty(event.target.value)
        }
      />

      <input
        type="text"
        placeholder="Bild-URL"
        value={recipeImage}
        onChange={(event) => setRecipeImage(event.target.value)}
      />

      <button type="submit">
        {editingRecipe ? 'Uppdatera recept' : 'Lägg till recept'}
      </button>
    </form>
  )
}

export default RecipeForm
