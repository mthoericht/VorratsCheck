import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InventoryEmptyState } from '@/app/components/inventory/InventoryEmptyState';

const meta: Meta<typeof InventoryEmptyState> = {
  component: InventoryEmptyState,
  title: 'Inventory/InventoryEmptyState',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InventoryEmptyState>;

export const Default: Story = {
  args: { onAddClick: fn() },
};
