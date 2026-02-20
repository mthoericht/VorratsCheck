import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RecipeCard } from '@/app/components/recipe/RecipeCard';
import type { RecipeWithMatch } from '@/app/lib/recipe';

const meta: Meta<typeof RecipeCard> = {
  component: RecipeCard,
  title: 'Components/Recipe/RecipeCard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RecipeCard>;

const sampleRecipe: RecipeWithMatch = {
  id: '1',
  name: 'Spaghetti Carbonara',
  ingredients: [
    { name: 'Spaghetti', quantity: 400, unit: 'g' },
    { name: 'Speck', quantity: 150, unit: 'g' },
    { name: 'Eier', quantity: 2, unit: 'stk' },
  ],
  instructions: ['Nudeln kochen', 'Speck anbraten', 'Mit Eiern vermengen'],
  cookingTime: 25,
  difficulty: 'easy',
  servings: 2,
  availableIngredients: [
    { name: 'Spaghetti', quantity: 400, unit: 'g' },
    { name: 'Eier', quantity: 2, unit: 'stk' },
  ],
  missingIngredients: [{ name: 'Speck', quantity: 150, unit: 'g' }],
  matchPercentage: 66,
  totalIngredientsCount: 3,
};

export const Default: Story = {
  args: {
    recipe: sampleRecipe,
    onClick: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const FullMatch: Story = {
  args: {
    recipe: {
      ...sampleRecipe,
      id: '2',
      name: 'Salat',
      missingIngredients: [],
      availableIngredients: sampleRecipe.ingredients,
      matchPercentage: 100,
    },
    onClick: fn(),
    onEdit: fn(),
    onDelete: fn(),
  },
};
