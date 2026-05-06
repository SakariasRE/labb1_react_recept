import { Link } from 'react-router-dom'
import type { Recipe } from '../types/Recipe'

interface RecipeCardProps {
  recipe: Recipe
  onDelete: (id: number) => void
  onEdit: (recipe: Recipe) => void
}

function RecipeCard({
  recipe,
  onDelete,
  onEdit,
}: RecipeCardProps) {
  return (
    <div className="card">
      <Link to={`/recipes/${recipe.id}`}>
        <img src={recipe.image} alt={recipe.name} />
      </Link>

      <h2>{recipe.name}</h2>

      <p>
        <strong>Ingredienser:</strong>{' '}
        {recipe.ingredients.slice(0, 4).join(', ')}
      </p>

      <p>
        <strong>Svårighet:</strong> {recipe.difficulty}
      </p>

      <div className="buttons">
        <button onClick={() => onEdit(recipe)}>
          Edit
        </button>

        <button onClick={() => onDelete(recipe.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default RecipeCard
