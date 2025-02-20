interface Step {
  number: number;
  step: string;
  ingredients?: {
    id: number;
    name: string;
    localizedName: string;
    image: string;
  }[];
  equipment?: {
    id: number;
    name: string;
    localizedName: string;
    image: string;
  }[];
}

interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  instructions: string;
  analyzedInstructions?: AnalyzedInstruction[];
  extendedIngredients: {
    id: number;
    original: string;
    aisle: string | null;
    amount: number;
    unit: string;
  }[];
}