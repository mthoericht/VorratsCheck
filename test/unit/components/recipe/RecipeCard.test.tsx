import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeCard } from '@/app/components/recipe/RecipeCard';
import { useSettingsStore } from '@/app/stores/settingsStore';
import type { RecipeWithMatch } from '@/app/lib/recipe';

describe('RecipeCard', () => 
{
  beforeEach(() => 
  {
    useSettingsStore.setState({ locale: 'de' });
  });

  const mockRecipe: RecipeWithMatch = {
    id: '1',
    name: 'Spaghetti Bolognese',
    ingredients: [{ name: 'Nudeln' }, { name: 'Hackfleisch', quantity: 500, unit: 'g' }],
    instructions: ['Kochen'],
    cookingTime: 30,
    difficulty: 'easy',
    servings: 4,
    userId: 'u1',
    availableIngredients: [{ name: 'Nudeln' }],
    missingIngredients: [{ name: 'Hackfleisch', quantity: 500, unit: 'g' }],
    matchPercentage: 50,
    totalIngredientsCount: 2,
  };

  it('renders recipe name, servings and difficulty', () => 
  {
    const onClick = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <RecipeCard
        recipe={mockRecipe}
        onClick={onClick}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText('Spaghetti Bolognese')).toBeInTheDocument();
    expect(screen.getByText(/4 Portionen · 30 Minuten/)).toBeInTheDocument();
    expect(screen.getByText('Einfach')).toBeInTheDocument();
    expect(screen.getByText('50% verfügbar')).toBeInTheDocument();
    expect(screen.getByText('Zutaten:')).toBeInTheDocument();
    expect(screen.getByText('Rezept anzeigen')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => 
  {
    const onClick = vi.fn();
    render(
      <RecipeCard
        recipe={mockRecipe}
        onClick={onClick}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText('Spaghetti Bolognese'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows missing ingredients', () => 
  {
    render(
      <RecipeCard
        recipe={mockRecipe}
        onClick={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText(/Fehlt:/)).toBeInTheDocument();
    expect(screen.getByText(/500 g Hackfleisch/)).toBeInTheDocument();
  });
});
