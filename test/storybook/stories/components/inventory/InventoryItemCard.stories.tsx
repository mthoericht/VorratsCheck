import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InventoryItemCard } from '@/app/components/inventory/InventoryItemCard';
import type { InventoryItem } from '@/app/stores/inventoryStore';

const meta: Meta<typeof InventoryItemCard> = {
  component: InventoryItemCard,
  title: 'Inventory/InventoryItemCard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InventoryItemCard>;

const sampleItem: InventoryItem = {
  id: '1',
  name: 'Vollmilch',
  category: 'Milchprodukte',
  brand: 'Bio',
  quantity: 2,
  unit: 'l',
  expiryDate: '2025-03-01',
  location: 'Kühlschrank',
  addedDate: '2025-01-15',
};

export const Default: Story = {
  args: {
    item: sampleItem,
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const NoExpiry: Story = {
  args: {
    item: { ...sampleItem, id: '2', expiryDate: undefined },
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const Expired: Story = {
  args: {
    item: { ...sampleItem, id: '3', expiryDate: '2024-01-01' },
    onEdit: fn(),
    onDelete: fn(),
  },
};
