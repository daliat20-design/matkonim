export interface Ingredient {
  item: string;
  amount: string;
  icon?: string;
}

export interface Step {
  stepNumber: number;
  text: string;
  note?: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  contributor: string; // e.g. "המתכון של סבתא אליס"
  contributorRole?: string; // "סבתא", "אמא", "דודה", etc.
  category: 'starters' | 'mains' | 'casserole' | 'baking' | 'fish' | 'soup' | 'dessert' | 'sweets' | 'salads' | 'sauces';
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'קל' | 'בינוני' | 'למשקיעים';
  ingredients: Ingredient[];
  steps: Step[];
  secretTip: string; // טיפ של סבתא
  familyMemory?: string; // זיכרון משפחתי
  imageUrl: string;
  imageAlt?: string;
  isFavorite?: boolean;
  notes?: string;
}

export type BookThemeId = 'illustrated' | 'notebook' | 'rustic' | 'heritage';

export interface BookTheme {
  id: BookThemeId;
  name: string;
  description: string;
  previewColor: string;
  paperClass: string;
  textColor: string;
  headingFont: string;
  titleFont: string;
  accentColor: string;
  washiTapeColor: string;
  spineShadow: string;
  coverTexture: string;
  ringBinder?: boolean;
  vintageStampColor: string;
}
