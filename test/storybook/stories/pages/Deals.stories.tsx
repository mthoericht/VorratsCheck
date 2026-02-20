import type { Meta, StoryObj } from '@storybook/react';
import { Deals } from '../../../../src/app/pages/Deals';
import { storeLoader, applyStoreValues, type StoreValues } from './withStoreState';
import { mockDeals, mockMustHave, mockWishlist, emptyDeals, emptyMustHave, emptyWishlist } from '../../../mocks/pages';

const mockValues: StoreValues = {
  deals: { items: mockDeals, loaded: true },
  mustHave: { items: mockMustHave, loaded: true },
  wishlist: { items: mockWishlist, loaded: true },
};
const emptyValues: StoreValues = {
  deals: { items: emptyDeals, loaded: true },
  mustHave: { items: emptyMustHave, loaded: true },
  wishlist: { items: emptyWishlist, loaded: true },
};

const meta: Meta<typeof Deals> = {
  component: Deals,
  title: 'Pages/Deals',
  parameters: {
    docs: {
      description: {
        component: 'Angebote-Seite: Deals mit Filter (Alle / Must-Have / Wunschliste), Stats und Karten.',
      },
    },
  },
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

type Story = StoryObj<typeof Deals>;

export const MitBeispieldaten: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Angebote mit mehreren Deals. Einige treffen die Must-Have-Liste (z. B. Milch, Butter), andere die Wunschliste (z. B. Olivenöl, Pasta). Filter in der Toolbar umschaltbar.',
      },
    },
    storeVariant: 'mock',
  },
  loaders: [storeLoader(mockValues)],
};

export const Leer: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Angebote ohne Deals – leere Liste und Empty-State.',
      },
    },
    storeVariant: 'empty',
  },
  loaders: [storeLoader(emptyValues)],
};
