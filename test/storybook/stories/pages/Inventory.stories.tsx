import type { Meta, StoryObj } from '@storybook/react';
import { Inventory } from '../../../../src/app/pages/Inventory';
import { storeLoader, applyStoreValues, type StoreValues } from './withStoreState';
import { mockInventory, mockCategories, emptyInventory, emptyCategories } from '../../../mocks/pages';

const mockValues: StoreValues = {
  inventory: { items: mockInventory, loaded: true },
  categories: { items: mockCategories, loaded: true },
};
const emptyValues: StoreValues = {
  inventory: { items: emptyInventory, loaded: true },
  categories: { items: emptyCategories, loaded: true },
};

const meta: Meta<typeof Inventory> = {
  component: Inventory,
  title: 'Pages/Inventory',
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

type Story = StoryObj<typeof Inventory>;

export const MitBeispieldaten: Story = {
  parameters: {
    docs: { description: { story: 'Vorrat mit Artikeln und Kategorien.' } },
    storeVariant: 'mock',
  },
  loaders: [storeLoader(mockValues)],
};

export const Leer: Story = {
  parameters: {
    docs: { description: { story: 'Vorrat ohne Einträge.' } },
    storeVariant: 'empty',
  },
  loaders: [storeLoader(emptyValues)],
};
