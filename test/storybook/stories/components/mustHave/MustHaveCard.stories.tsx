import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MustHaveCard } from '@/app/components/mustHave/MustHaveCard';
import type { MustHaveItem } from '@/app/stores/mustHaveStore';

const meta: Meta<typeof MustHaveCard> = {
  component: MustHaveCard,
  title: 'Components/MustHave/MustHaveCard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MustHaveCard>;

const sampleItem: MustHaveItem = {
  id: '1',
  name: 'Milch',
  category: 'Milchprodukte',
  minQuantity: 2,
};

const statusOk = {
  current: 2,
  needed: 2,
  displayCurrent: 2,
  displayNeeded: 2,
  displayUnit: 'l',
  isLow: false,
};

const statusLow = {
  current: 0,
  needed: 2,
  displayCurrent: 0,
  displayNeeded: 2,
  displayUnit: 'l',
  isLow: true,
};

export const Sufficient: Story = {
  args: {
    item: sampleItem,
    status: statusOk,
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const LowStock: Story = {
  args: {
    item: sampleItem,
    status: statusLow,
    onEdit: fn(),
    onDelete: fn(),
  },
};
