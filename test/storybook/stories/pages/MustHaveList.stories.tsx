import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MustHaveList } from '../../../../src/app/pages/MustHaveList';
import { storeLoader, applyStoreValues, type StoreValues } from './withStoreState';
import { mockMustHave, mockInventory, mockCategories, emptyMustHave, emptyInventory, emptyCategories } from '../../../mocks/pages';

const mockValues: StoreValues = {
  mustHave: { items: mockMustHave, loaded: true },
  inventory: { items: mockInventory, loaded: true },
  categories: { items: mockCategories, loaded: true },
};
const emptyValues: StoreValues = {
  mustHave: { items: emptyMustHave, loaded: true },
  inventory: { items: emptyInventory, loaded: true },
  categories: { items: emptyCategories, loaded: true },
};

const meta: Meta<typeof MustHaveList> = {
  component: MustHaveList,
  title: 'Pages/MustHaveList',
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

type Story = StoryObj<typeof MustHaveList>;

export const MitBeispieldaten: Story = {
  parameters: {
    docs: { description: { story: 'Must-Have-Liste mit Einträgen und Bestandsabgleich.' } },
    storeVariant: 'mock',
  },
  loaders: [storeLoader(mockValues)],
};

export const Leer: Story = {
  parameters: {
    docs: { description: { story: 'Must-Have-Liste ohne Einträge.' } },
    storeVariant: 'empty',
  },
  loaders: [storeLoader(emptyValues)],
};
