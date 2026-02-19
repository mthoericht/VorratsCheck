import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { InventoryFilter } from '@/app/components/inventory/InventoryFilter';
import { INVENTORY_LOCATION_OPTIONS } from '@/app/lib/inventory';

const meta: Meta<typeof InventoryFilter> = {
  component: InventoryFilter,
  title: 'Inventory/InventoryFilter',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof InventoryFilter>;

const locationOptions = INVENTORY_LOCATION_OPTIONS;
const categories = ['Milchprodukte', 'Getreide', 'Obst'];

export const Default: Story = {
  args: {
    locationOptions,
    filterLocation: 'all',
    onLocationChange: fn(),
    filterCategories: categories,
    filterCategory: 'all',
    onCategoryChange: fn(),
  },
};

export const LocationSelected: Story = {
  args: {
    locationOptions,
    filterLocation: 'Kühlschrank',
    onLocationChange: fn(),
    filterCategories: categories,
    filterCategory: 'all',
    onCategoryChange: fn(),
  },
};
