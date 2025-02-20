import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMENI_API_KEY;
const MODEL_INSTRUCTIONS = `
You are a culinary expert specializing in recipe modifications. Your task is to:

1. Analyze the provided recipe's ingredients and instructions
2. Apply the specified dietary restrictions while maintaining:
   - Taste profile and flavor balance
   - Proper texture and consistency
   - Cooking techniques that work with substitute ingredients
3. Implement additional modification requests
4. Ensure the modified recipe remains practical and executable

For each modification:
- Explain why each substitution was made
- Provide specific measurements for replacements
- Note any changes to cooking time/temperature
- Include tips for working with substitute ingredients

Return the recipe in this format:
---
Original Ingredients:
[List original ingredients]

Modified Ingredients:
[List full modified ingredients list with explanations after the entire ingredients list]

Modified Instructions:
[Step-by-step instructions]

Modification Notes:
[Important tips and explanations]
---
`;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: MODEL_INSTRUCTIONS,
});

export async function getModifiedRecipe(
  recipe: string,
  formattedRestrictions: string,
  additionalModifications: string
): Promise<string> {
  const prompt = `Recipe: ${recipe.trim()}\n\nDietary Restrictions: ${formattedRestrictions}\n\nAdditional Modifications: ${additionalModifications}`;
  console.log(`Formatted Prompt:\n\n${prompt}`);

  const modifiedRecipe = await model.generateContent(prompt);
  console.log(modifiedRecipe.response.text());
  return modifiedRecipe.response.text();
}

