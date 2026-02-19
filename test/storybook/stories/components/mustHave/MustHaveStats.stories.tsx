import type { Meta, StoryObj } from '@storybook/react';
import { MustHaveStats } from '@/app/components/mustHave/MustHaveStats';

const meta: Meta<typeof MustHaveStats> = {
  component: MustHaveStats,
  title: 'MustHave/MustHaveStats',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MustHaveStats>;

export const Default: Story = {
  args: { totalCount: 10, sufficientCount: 7, lowCount: 3 },
};

export const AllSufficient: Story = {
  args: { totalCount: 5, sufficientCount: 5, lowCount: 0 },
};

export const AllLow: Story = {
  args: { totalCount: 4, sufficientCount: 0, lowCount: 4 },
};
