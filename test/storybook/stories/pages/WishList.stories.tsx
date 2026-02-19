import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { WishList } from '../../../../src/app/pages/WishList';
import { storeLoader, applyStoreValues, type StoreValues } from './withStoreState';
import { mockWishlist, mockCategories, emptyWishlist, emptyCategories } from '../../../mocks/pages';

const mockValues: StoreValues = {
  wishlist: { items: mockWishlist, loaded: true },
  categories: { items: mockCategories, loaded: true },
};
const emptyValues: StoreValues = {
  wishlist: { items: emptyWishlist, loaded: true },
  categories: { items: emptyCategories, loaded: true },
};

const meta: Meta<typeof WishList> = {
  component: WishList,
  title: 'Pages/WishList',
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

type Story = StoryObj<typeof WishList>;

export const MitBeispieldaten: Story = {
  parameters: {
    docs: { description: { story: 'Wunschliste mit Einträgen nach Priorität.' } },
    storeVariant: 'mock',
  },
  loaders: [storeLoader(mockValues)],
};

export const Leer: Story = {
  parameters: {
    docs: { description: { story: 'Wunschliste ohne Einträge.' } },
    storeVariant: 'empty',
  },
  loaders: [storeLoader(emptyValues)],
};
