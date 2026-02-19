import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Quantity } from '@/app/components/Quantity';

const meta: Meta<typeof Quantity> = {
  component: Quantity,
  title: 'Components/Quantity',
  tags: ['autodocs'],
  argTypes: {
    quantity: { control: 'text' },
    unit: { control: 'select', options: ['g', 'kg', 'ml', 'l', 'Stück'] },
  },
};

export default meta;

type Story = StoryObj<typeof Quantity>;

export const Default: Story = {
  args: {
    quantity: '400',
    unit: 'g',
    onQuantityChange: fn(),
    onUnitChange: fn(),
  },
};

export const Compact: Story = {
  args: {
    quantity: 2,
    unit: 'l',
    onQuantityChange: fn(),
    onUnitChange: fn(),
    compact: true,
  },
};

export const WithLabel: Story = {
  args: {
    quantity: '1',
    unit: 'Stück',
    label: 'Menge',
    onQuantityChange: fn(),
    onUnitChange: fn(),
  },
};
