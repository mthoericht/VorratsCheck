import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { WishlistPrioritySection } from '@/app/components/wishlist/WishlistPrioritySection';
import type { WishListItem } from '@/app/stores/wishlistStore';

const meta: Meta<typeof WishlistPrioritySection> = {
  component: WishlistPrioritySection,
  title: 'Components/Wishlist/WishlistPrioritySection',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-full min-w-[320px] max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof WishlistPrioritySection>;

const highItems: WishListItem[] = [
  { id: '1', name: 'Olivenöl', type: 'specific', priority: 'high' },
  { id: '2', name: 'Parmesan', type: 'specific', priority: 'high' },
];

export const HighPriority: Story = {
  args: {
    priority: 'high',
    items: highItems,
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const Empty: Story = {
  args: {
    priority: 'medium',
    items: [],
    onEdit: fn(),
    onDelete: fn(),
  },
};
