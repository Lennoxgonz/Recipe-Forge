// RecipeModifier.tsx
import { JSX, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  ButtonGroup,
  Nav,
  Spinner,
  Alert,
} from "react-bootstrap";
import { getModifiedRecipe } from "../api/gemeniAPI";
import { fetchRecipesByQuery } from "../api/spoonacularAPI";
import RecipeGrid from "./RecipeGrid";
import { Recipe } from '../types/recipe.types';

interface DietaryRestriction {
  id: string;
  label: string;
}

function RecipeModifier(): JSX.Element {
  const [activeTab, setActiveTab] = useState<'modify' | 'search'>('modify');
  const [recipe, setRecipe] = useState<string>("");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [additionalModifications, setAdditionalModifications] = useState<string>("");
  const [modifiedRecipe, setModifiedRecipe] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modifyError, setModifyError] = useState<string>("");
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string>("");

  const dietaryRestrictions: DietaryRestriction[] = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "nut-free", label: "Nut-Free" },
    { id: "low-carb", label: "Low-Carb" },
  ];

  function toggleRestriction(restrictionId: string): void {
    setRestrictions((prev) =>
      prev.includes(restrictionId)
        ? prev.filter((r) => r !== restrictionId)
        : [...prev, restrictionId]
    );
  }

  async function handleModifyRecipe(): Promise<void> {
    if (!recipe.trim()) {
      setModifyError("Please enter a recipe to modify");
      return;
    }

    setLoading(true);
    setModifyError("");
    try {
      const formattedRestrictions = restrictions
        .map((id) => dietaryRestrictions.find((r) => r.id === id)?.label)
        .filter(Boolean)
        .join(", ");

      const modifiedRecipe = await getModifiedRecipe(
        recipe,
        formattedRestrictions,
        additionalModifications
      );
      setModifiedRecipe(modifiedRecipe);
    } catch (error) {
      setModifyError("Failed to modify recipe. Please try again.");
      console.error("Error modifying recipe:", error);
    }
    setLoading(false);
  }

  async function handleSearchRecipes(): Promise<void> {
    if (!searchQuery.trim()) {
      setSearchError("Please enter a search query");
      return;
    }
    
    setSearchLoading(true);
    setSearchError("");
    setSearchResults([]);
    
    try {
      const recipes = await fetchRecipesByQuery(searchQuery);
      setSearchResults(recipes);
      if (recipes.length === 0) {
        setSearchError("No recipes found. Try different keywords.");
      }
    } catch (error) {
      setSearchError("Failed to fetch recipes. Please try again.");
      console.error("Error searching recipes:", error);
    }
    setSearchLoading(false);
  }

  function handleSelectRecipe(recipe: Recipe): void {
    if (!recipe.instructions) {
      setSearchError("This recipe doesn't have instructions available.");
      return;
    }

    // Format the recipe text with ingredients and instructions
    const ingredients = recipe.extendedIngredients
      .map((ing: { original: any; }) => ing.original)
      .join('\n');

    const formattedRecipe = `${recipe.title}

Ingredients:
${ingredients}

Instructions:
${recipe.instructions}`;

    setRecipe(formattedRecipe);
    setActiveTab('modify');
  }

  function clearErrors(): void {
    setSearchError("");
    setModifyError("");
  }

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Header>
          <Card.Title className="text-center mb-3">
            AI Recipe Modifier
          </Card.Title>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'modify'}
                onClick={() => {
                  setActiveTab('modify');
                  clearErrors();
                }}
              >
                Modify Recipe
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'search'}
                onClick={() => {
                  setActiveTab('search');
                  clearErrors();
                }}
              >
                Search Recipes
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {activeTab === 'modify' ? (
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleModifyRecipe();
            }}>
              {modifyError && (
                <Alert variant="danger" className="mb-3">{modifyError}</Alert>
              )}

              <Form.Group className="mb-4">
                <Form.Label>Original Recipe:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={recipe}
                  onChange={(e) => setRecipe(e.target.value)}
                  rows={6}
                  placeholder="Paste your recipe here..."
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Dietary Restrictions:</Form.Label>
                <div>
                  <ButtonGroup className="flex-wrap">
                    {dietaryRestrictions.map(({ id, label }) => (
                      <Button
                        key={id}
                        variant={
                          restrictions.includes(id)
                            ? "primary"
                            : "outline-primary"
                        }
                        onClick={() => toggleRestriction(id)}
                        className="m-1"
                        type="button"
                      >
                        {label}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Additional Modifications:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={additionalModifications}
                  onChange={(e) => setAdditionalModifications(e.target.value)}
                  rows={2}
                  placeholder="Write any other modifications you would like to make"
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={!recipe.trim() || loading}
                className="w-100 mb-4"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Modifying Recipe...
                  </>
                ) : (
                  "Modify Recipe"
                )}
              </Button>

              {modifiedRecipe && (
                <>
                  <h5>Modified Recipe:</h5>
                  <Card bg="light">
                    <Card.Body>
                      <div
                        className="text-break"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {modifiedRecipe}
                      </div>
                    </Card.Body>
                  </Card>
                </>
              )}
            </Form>
          ) : (
            <div>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSearchRecipes();
              }}>
                <Form.Group className="mb-4">
                  <Form.Label>Search Recipes:</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter keywords (e.g., 'chicken pasta')"
                    />
                    <Button 
                      variant="primary"
                      type="submit"
                      disabled={searchLoading || !searchQuery.trim()}
                    >
                      {searchLoading ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </div>
                </Form.Group>
              </Form>

              {searchError && (
                <Alert variant="danger">{searchError}</Alert>
              )}

              {searchLoading ? (
                <div className="text-center mt-4">
                  <Spinner animation="border" />
                </div>
              ) : (
                searchResults.length > 0 && (
                  <div className="mt-4">
                    <h5>Search Results:</h5>
                    <RecipeGrid 
                      recipes={searchResults}
                      onRecipeSelect={handleSelectRecipe}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecipeModifier;