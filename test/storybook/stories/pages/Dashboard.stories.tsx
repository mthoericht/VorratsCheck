import type { Meta, StoryObj } from '@storybook/react';
import { Dashboard } from '../../../../src/app/pages/Dashboard';
import { storeLoader, applyStoreValues, type StoreValues } from './withStoreState';
import { mockInventory, mockMustHave, mockWishlist, emptyInventory, emptyMustHave, emptyWishlist } from '../../../mocks/pages';

const mockValues: StoreValues = {
  inventory: { items: mockInventory, loaded: true },
  mustHave: { items: mockMustHave, loaded: true },
  wishlist: { items: mockWishlist, loaded: true },
};
const emptyValues: StoreValues = {
  inventory: { items: emptyInventory, loaded: true },
  mustHave: { items: emptyMustHave, loaded: true },
  wishlist: { items: emptyWishlist, loaded: true },
};

const meta: Meta<typeof Dashboard> = {
  component: Dashboard,
  title: 'Pages/Dashboard',
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

type Story = StoryObj<typeof Dashboard>;

export const MitBeispieldaten: Story = {
  parameters: {
    docs: { description: { story: 'Dashboard mit Vorrat, Must-Have und Wunschliste.' } },
    storeVariant: 'mock',
  },
  loaders: [storeLoader(mockValues)],
};

export const Leer: Story = {
  parameters: {
    docs: { description: { story: 'Dashboard ohne Einträge.' } },
    storeVariant: 'empty',
  },
  loaders: [storeLoader(emptyValues)],
};
