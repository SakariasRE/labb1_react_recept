import RecipeForm from '../components/RecipeForm'
import type { Recipe } from '../types/Recipe'

interface AddRecipePageProps {
  onSubmit: (recipe: Recipe) => void
  editingRecipe: Recipe | null
}

function AddRecipePage({
  onSubmit,
  editingRecipe,
}: AddRecipePageProps) {
  return (
    <main className="page">
      <section className="form-page">
        <h1>
          {editingRecipe
            ? 'Redigera recept'
            : 'Lägg till ett nytt recept'}
        </h1>

        <p>
          Fyll i receptets namn, ingredienser, svårighet och bild.
        </p>

        <RecipeForm
          onSubmit={onSubmit}
          editingRecipe={editingRecipe}
        />
      </section>
    </main>
  )
}

export default AddRecipePage
