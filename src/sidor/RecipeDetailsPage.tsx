import { Link, useParams } from 'react-router-dom'
import type { Recipe } from '../types/Recipe'

interface RecipeDetailsPageProps {
  recipes: Recipe[]
}

function RecipeDetailsPage({
  recipes,
}: RecipeDetailsPageProps) {
  const { id } = useParams()

  const recipe = recipes.find(
    (recipe) => recipe.id === Number(id)
  )

  if (!recipe) {
    return (
      <main className="page">
        <h1>Receptet hittades inte</h1>
        <Link to="/">Tillbaka till startsidan</Link>
      </main>
    )
  }

  return (
    <main className="page">
      <section className="details-card">
        <img src={recipe.image} alt={recipe.name} />

        <div>
          <h1>{recipe.name}</h1>

          <p>
            <strong>Svårighet:</strong> {recipe.difficulty}
          </p>

          <h2>Ingredienser</h2>

          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <Link to="/" className="back-link">
            Tillbaka till alla recept
          </Link>
        </div>
      </section>
    </main>
  )
}

export default RecipeDetailsPage
