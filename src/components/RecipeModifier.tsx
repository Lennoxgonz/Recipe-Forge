import { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { getModifiedRecipe } from "../api/gemeni";

interface DietaryRestriction {
  id: string;
  label: string;
}

function RecipeModifier() {
  const [recipe, setRecipe] = useState<string>("");
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [additionalModifications, setAdditionalModifications] =
    useState<string>("");
  const [modifiedRecipe, setModifiedRecipe] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    try {
      const formattedRestrictions = restrictions
        .map((id) => dietaryRestrictions.find((r) => r.id === id)?.label)
        .filter(Boolean)
        .join(", ");

      const modifiedRecipe = await getModifiedRecipe(recipe, formattedRestrictions, additionalModifications);
      setModifiedRecipe(modifiedRecipe);
    } catch (error) {
      console.error("Error modifying recipe:", error);
    }
    setLoading(false);
  }

  return (
    <Container className="py-4">
      <Card className="mb-4">
        <Card.Header>
          <Card.Title className="text-center mb-0">
            AI Recipe Modifier
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
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
              onClick={handleModifyRecipe}
              disabled={!recipe || loading}
              className="w-100 mb-4"
            >
              {loading ? "Modifying Recipe..." : "Modify Recipe"}
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
        </Card.Body>
      </Card>
    </Container>
  );
}

export default RecipeModifier;
