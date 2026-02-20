import type { Meta, StoryObj } from '@storybook/react';
import { DealsEmptyState } from '@/app/components/deals/DealsEmptyState';

const meta: Meta<typeof DealsEmptyState> = {
  component: DealsEmptyState,
  title: 'Components/Deals/DealsEmptyState',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DealsEmptyState>;

export const Default: Story = {};
