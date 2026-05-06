import RecipeCard from '../components/RecipeCard'
import type { Recipe } from '../types/Recipe'

interface HomePageProps {
    recipes: Recipe[]
    onDelete: (id: number) => void
    onEdit: (recipe: Recipe) => void
}

function HomePage({ recipes, onDelete, onEdit }: HomePageProps) {
    return (
        <div className="home">
            <h1>Recipes</h1>
            <div className="recipes-grid">
                {recipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </div>
        </div>
    )
}

export default HomePage
