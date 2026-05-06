import { useParams } from 'react-router-dom'
import type { Recipe } from '../types/Recipe'

interface RecipeDetailsPageProps {
    recipes: Recipe[]
}

function RecipeDetailsPage({ recipes }: RecipeDetailsPageProps) {
    const { id } = useParams<{ id: string }>()

    if (!id) {
        return <div className="error-message">Invalid recipe ID</div>
    }

    const recipe = recipes.find((r) => r.id === Number(id))

    if (!recipe) {
        return <div className="error-message">Recipe not found</div>
    }

    return (
        <div className="recipe-details">
            <h1>{recipe.name}</h1>
            <img src={recipe.image} alt={recipe.name} />
            <p>
                <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
            </p>
            <p>
                <strong>Difficulty:</strong> {recipe.difficulty}
            </p>
        </div>
    )
}

export default RecipeDetailsPage
