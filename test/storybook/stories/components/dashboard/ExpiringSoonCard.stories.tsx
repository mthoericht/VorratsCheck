import type { Meta, StoryObj } from '@storybook/react';
import { ExpiringSoonCard } from '@/app/components/dashboard/ExpiringSoonCard';

const meta: Meta<typeof ExpiringSoonCard> = {
  component: ExpiringSoonCard,
  title: 'Components/Dashboard/ExpiringSoonCard',
  tags: ['autodocs'],
  argTypes: { maxItems: { control: 'number' } },
};

export default meta;

type Story = StoryObj<typeof ExpiringSoonCard>;

const sampleItems = [
  { id: '1', name: 'Frischmilch', expiryDate: '2025-02-22' },
  { id: '2', name: 'Käse', expiryDate: '2025-02-24' },
  { id: '3', name: 'Quark', expiryDate: '2025-02-25' },
];

export const WithItems: Story = {
  args: { items: sampleItems, maxItems: 5 },
};

export const LimitedDisplay: Story = {
  args: { items: sampleItems, maxItems: 2 },
};

export const Empty: Story = {
  args: { items: [] },
};
