export interface Recipe {
  title: string;
  image: string;
  extendedIngredients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  analyzedInstructions: {
    steps: {
      step: string;
    }[];
  }[];
}