import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Recipes } from '../../../../src/app/pages/Recipes';
import { storeLoader, applyStoreValues, type StoreValues } from './withStoreState';
import { mockRecipes, mockInventory, emptyRecipes, emptyInventory } from '../../../mocks/pages';

const mockValues: StoreValues = {
  recipes: { items: mockRecipes, loaded: true },
  inventory: { items: mockInventory, loaded: true },
};
const emptyValues: StoreValues = {
  recipes: { items: emptyRecipes, loaded: true },
  inventory: { items: emptyInventory, loaded: true },
};

const meta: Meta<typeof Recipes> = {
  component: Recipes,
  title: 'Pages/Recipes',
  decorators: [
    (Story, context) =>
    {
      const variant = context.parameters.storeVariant as 'mock' | 'empty' | undefined;
      applyStoreValues(variant === 'empty' ? emptyValues : mockValues);
      return <Story />;
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Recipes>;

export const MitBeispieldaten: Story = {
  parameters: {
    docs: { description: { story: 'Rezepte mit Treffern (voll/teilweise/kein Match zum Vorrat).' } },
    storeVariant: 'mock',
  },
  loaders: [storeLoader(mockValues)],
};

export const Leer: Story = {
  parameters: {
    docs: { description: { story: 'Rezepte ohne Einträge.' } },
    storeVariant: 'empty',
  },
  loaders: [storeLoader(emptyValues)],
};
