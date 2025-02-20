import { Row, Col } from "react-bootstrap";
import RecipeCard from "./RecipeCard";
import { JSX } from "react";
import { Recipe } from "../types/recipe.types";

interface RecipeGridProps {
  recipes: Recipe[];
  handleRecipeSelect: (recipe: Recipe) => void;
}

function RecipeGrid({ recipes, handleRecipeSelect }: RecipeGridProps): JSX.Element {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.title.toLowerCase().replace(/\s+/g, "")}>
          <div role="button" style={{ cursor: "pointer" }} onClick={() => handleRecipeSelect(recipe)}>
            <RecipeCard title={recipe.title} imageURL={recipe.image} />
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default RecipeGrid;
