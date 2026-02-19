import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { WishlistEmptyState } from '@/app/components/wishlist/WishlistEmptyState';

const meta: Meta<typeof WishlistEmptyState> = {
  component: WishlistEmptyState,
  title: 'Wishlist/WishlistEmptyState',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof WishlistEmptyState>;

export const Default: Story = {
  args: { onAddClick: fn() },
};
