import type { Meta, StoryObj } from '@storybook/react';
import { DealCard } from '@/app/components/deals/DealCard';
import type { Deal } from '@/app/stores/dealsStore';

const meta: Meta<typeof DealCard> = {
  component: DealCard,
  title: 'Components/Deals/DealCard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DealCard>;

const sampleDeal: Deal = {
  id: 'deal-1',
  product: 'Bio-Milch',
  name: 'Milchprodukte',
  store: 'Rewe',
  originalPrice: 1.39,
  discountPrice: 0.99,
  discount: 29,
  validUntil: '2025-02-28',
  distance: 0.5,
  inStock: true,
};

export const Default: Story = {
  args: {
    deal: sampleDeal,
    isMustHave: true,
    isWishList: false,
  },
};

export const MustHaveUndWunschliste: Story = {
  args: {
    deal: { ...sampleDeal, product: 'Olivenöl nativ', name: 'Öle', discount: 25 },
    isMustHave: false,
    isWishList: true,
  },
};

export const NichtAufLager: Story = {
  args: {
    deal: { ...sampleDeal, inStock: false },
    isMustHave: false,
    isWishList: false,
  },
};
