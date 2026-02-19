import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { WishlistItemCard } from '@/app/components/wishlist/WishlistItemCard';
import type { WishListItem } from '@/app/stores/wishlistStore';

const meta: Meta<typeof WishlistItemCard> = {
  component: WishlistItemCard,
  title: 'Wishlist/WishlistItemCard',
  tags: ['autodocs'],
  argTypes: { item: { control: false } },
  decorators: [
    (Story) => (
      <div className="w-full min-w-[320px] max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WishlistItemCard>;

const sampleItem: WishListItem = {
  id: '1',
  name: 'Olivenöl',
  type: 'specific',
  category: 'Öle',
  brand: 'Bio',
  priority: 'high',
};

export const Default: Story = {
  args: {
    item: sampleItem,
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const LowPriority: Story = {
  args: {
    item: { ...sampleItem, id: '2', priority: 'low' },
    onEdit: fn(),
    onDelete: fn(),
  },
};
