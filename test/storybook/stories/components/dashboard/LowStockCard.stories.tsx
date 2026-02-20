import type { Meta, StoryObj } from '@storybook/react';
import { LowStockCard } from '@/app/components/dashboard/LowStockCard';

const meta: Meta<typeof LowStockCard> = {
  component: LowStockCard,
  title: 'Components/Dashboard/LowStockCard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof LowStockCard>;

const sampleItems = [
  { id: '1', name: 'Milch', minQuantity: 2 },
  { id: '2', name: 'Butter', minQuantity: 1 },
];

export const WithItems: Story = {
  args: { items: sampleItems },
};

export const Empty: Story = {
  args: { items: [] },
};
