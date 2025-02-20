import { Row, Col } from 'react-bootstrap';
import RecipeCard from './RecipeCard';
import { JSX } from 'react';
import { Recipe } from '../types/recipe.types';

interface RecipeGridProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
}

function RecipeGrid({ recipes, onRecipeSelect }: RecipeGridProps): JSX.Element {
  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {recipes.map((recipe) => (
        <Col key={recipe.id}>
          <div 
            onClick={() => onRecipeSelect(recipe)} 
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onRecipeSelect(recipe);
              }
            }}
          >
            <RecipeCard 
              title={recipe.title}
              imageURL={recipe.image}
            />
          </div>
        </Col>
      ))}
    </Row>
  );
}

export default RecipeGrid;