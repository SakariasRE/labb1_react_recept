import RecipeCard from '../components/RecipeCard'
import type { Recipe } from '../types/Recipe'

interface HomePageProps {
  recipes: Recipe[]
  onDelete: (id: number) => void
  onEdit: (recipe: Recipe) => void
}

function HomePage({
  recipes,
  onDelete,
  onEdit,
}: HomePageProps) {
  return (
    <main className="page">
      <section className="hero">
        <h1>Hitta ditt nästa favoritrecept</h1>
        <p>
          Bläddra bland recept, lägg till egna och klicka på ett
          recept för att läsa mer.
        </p>
      </section>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </main>
  )
}

export default HomePage
