import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/app/components/ui/badge';

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'UI/Badge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: 'Badge' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Sekundär' },
};

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Abgelaufen' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
};
