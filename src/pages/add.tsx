import RecipeForm from '../components/RecipeForm'
import type { Recipe } from '../types/Recipe'

interface AddRecipePageProps {
    onSubmit: (recipe: Recipe) => void
    editingRecipe: Recipe | null
}

function AddRecipePage({ onSubmit, editingRecipe }: AddRecipePageProps) {
    return (
        <div className="add-recipe-page">
            <h1>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h1>
            <RecipeForm onSubmit={onSubmit} editingRecipe={editingRecipe} />
        </div>
    )
}

export default AddRecipePage
