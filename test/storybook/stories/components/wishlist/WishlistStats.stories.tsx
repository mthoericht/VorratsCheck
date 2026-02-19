import type { Meta, StoryObj } from '@storybook/react';
import { WishlistStats } from '@/app/components/wishlist/WishlistStats';
import type { WishListItem } from '@/app/stores/wishlistStore';

const meta: Meta<typeof WishlistStats> = {
  component: WishlistStats,
  title: 'Wishlist/WishlistStats',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full min-w-[560px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WishlistStats>;

const sampleItems: WishListItem[] = [
  { id: '1', name: 'A', type: 'specific', priority: 'high' },
  { id: '2', name: 'B', type: 'specific', priority: 'high' },
  { id: '3', name: 'C', type: 'specific', priority: 'medium' },
  { id: '4', name: 'D', type: 'specific', priority: 'low' },
];

export const Default: Story = {
  args: { items: sampleItems },
};

export const Empty: Story = {
  args: { items: [] },
};
