import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InventoryFilterBar } from '@/app/components/inventory/InventoryFilterBar';

const meta: Meta<typeof InventoryFilterBar> = {
  component: InventoryFilterBar,
  title: 'Inventory/InventoryFilterBar',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InventoryFilterBar>;

const options = [
  { value: 'all', label: 'Alle' },
  { value: 'Kühlschrank', label: 'Kühlschrank' },
  { value: 'Gefrierfach', label: 'Gefrierfach' },
  { value: 'Vorrat', label: 'Vorrat' },
];

export const Default: Story = {
  args: {
    label: 'Lagerort',
    options,
    value: 'all',
    onChange: fn(),
    allLabel: 'Alle',
  },
};

export const ValueSelected: Story = {
  args: {
    label: 'Lagerort',
    options,
    value: 'Kühlschrank',
    onChange: fn(),
    allLabel: 'Alle',
  },
};
