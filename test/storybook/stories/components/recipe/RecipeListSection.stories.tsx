import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ChefHat } from 'lucide-react';
import { RecipeListSection } from '@/app/components/recipe/RecipeListSection';
import type { RecipeWithMatch } from '@/app/lib/recipe';

const meta: Meta<typeof RecipeListSection> = {
  component: RecipeListSection,
  title: 'Recipe/RecipeListSection',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RecipeListSection>;

const sampleRecipes: RecipeWithMatch[] = [
  {
    id: '1',
    name: 'Pasta',
    ingredients: [{ name: 'Nudeln' }],
    instructions: [],
    cookingTime: 10,
    difficulty: 'easy',
    servings: 2,
    availableIngredients: [],
    missingIngredients: [],
    matchPercentage: 100,
    totalIngredientsCount: 1,
  },
  {
    id: '2',
    name: 'Salat',
    ingredients: [{ name: 'Salat' }],
    instructions: [],
    cookingTime: 5,
    difficulty: 'easy',
    servings: 1,
    availableIngredients: [],
    missingIngredients: [],
    matchPercentage: 50,
    totalIngredientsCount: 2,
  },
];

export const Default: Story = {
  args: {
    title: 'Sofort kochbar',
    icon: <ChefHat className="w-5 h-5" />,
    recipes: sampleRecipes,
    onSelectRecipe: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const Empty: Story = {
  args: {
    title: 'Leer',
    icon: <ChefHat className="w-5 h-5" />,
    recipes: [],
    onSelectRecipe: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};
