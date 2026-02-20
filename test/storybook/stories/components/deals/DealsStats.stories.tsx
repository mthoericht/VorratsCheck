import type { Meta, StoryObj } from '@storybook/react';
import { DealsStats } from '@/app/components/deals/DealsStats';

const meta: Meta<typeof DealsStats> = {
  component: DealsStats,
  title: 'Components/Deals/DealsStats',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DealsStats>;

export const MitWerten: Story = {
  args: {
    totalCount: 12,
    mustHaveCount: 2,
    wishListCount: 3,
    avgDiscount: 24,
  },
};

export const Leer: Story = {
  args: {
    totalCount: 0,
    mustHaveCount: 0,
    wishListCount: 0,
    avgDiscount: 0,
  },
};
