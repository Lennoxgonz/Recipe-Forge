import { Recipe } from "../types/recipe.types";

export async function fetchRecipesByQuery(query: string): Promise<Recipe[]> {
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
  const url =
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}` +
    `&query=${encodeURIComponent(query)}` +
    "&instructionsRequired=true" +
    "&addRecipeInformation=true" +
    "&fillIngredients=true" +
    "&number=2" +
    "&addRecipeNutrition=false";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    const data = await response.json();
    const recipes: Recipe[] = data.results;
    console.log(recipes)

    return recipes;

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred while fetching recipes");
  }
}
