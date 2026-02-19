import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MustHaveEmptyState } from '@/app/components/mustHave/MustHaveEmptyState';

const meta: Meta<typeof MustHaveEmptyState> = {
  component: MustHaveEmptyState,
  title: 'MustHave/MustHaveEmptyState',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof MustHaveEmptyState>;

export const Default: Story = {
  args: { onAddClick: fn() },
};
