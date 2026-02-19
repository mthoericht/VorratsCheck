import type { Meta, StoryObj } from '@storybook/react';
import { ExpiredItemsCard } from '@/app/components/dashboard/ExpiredItemsCard';

const meta: Meta<typeof ExpiredItemsCard> = {
  component: ExpiredItemsCard,
  title: 'Dashboard/ExpiredItemsCard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ExpiredItemsCard>;

const sampleItems = [
  { id: '1', name: 'Joghurt', expiryDate: '2025-01-15' },
  { id: '2', name: 'Milch', expiryDate: '2025-01-10' },
];

export const WithItems: Story = {
  args: { items: sampleItems },
};

export const Empty: Story = {
  args: { items: [] },
};

export const SingleItem: Story = {
  args: { items: [{ id: '1', name: 'Abgelaufene Sahne', expiryDate: '2025-01-01' }] },
};
