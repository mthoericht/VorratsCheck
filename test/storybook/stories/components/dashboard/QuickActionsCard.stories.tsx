import type { Meta, StoryObj } from '@storybook/react';
import { QuickActionsCard } from '@/app/components/dashboard/QuickActionsCard';

const meta: Meta<typeof QuickActionsCard> = {
  component: QuickActionsCard,
  title: 'Components/Dashboard/QuickActionsCard',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof QuickActionsCard>;

export const Default: Story = {};
