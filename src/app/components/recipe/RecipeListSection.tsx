import React from 'react';
import { RecipeCard } from './RecipeCard';
import type { RecipeWithMatch } from '../../lib/recipe';
import { Box, Typography } from '@mui/material';

interface RecipeListSectionProps {
  title: string;
  icon: React.ReactNode;
  recipes: RecipeWithMatch[];
  onSelectRecipe: (recipe: RecipeWithMatch) => void;
  onEdit: (recipe: RecipeWithMatch) => void;
  onDelete: (id: string, name: string, e: React.MouseEvent) => void;
}

/** A section with heading and grid of RecipeCards (e.g. Ready to cook, Partially available). */
export function RecipeListSection({
  title,
  icon,
  recipes,
  onSelectRecipe,
  onEdit,
  onDelete,
}: RecipeListSectionProps) 
{
  if (recipes.length === 0) return null;

  return (
    <Box>
      <Typography variant="h6" component="h2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon}
        {title} ({recipes.length})
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          alignItems: 'stretch',
          gridAutoRows: '1fr',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
        }}
      >
        {recipes.map(recipe => (
          <Box key={recipe.id} sx={{ height: '100%' }}>
            <RecipeCard
              recipe={recipe}
              onClick={() => onSelectRecipe(recipe)}
              onEdit={() => onEdit(recipe)}
              onDelete={(e) => onDelete(recipe.id, recipe.name, e)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
