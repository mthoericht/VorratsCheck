import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from '@/app/components/ui/stat-card';
import { Package, Clock } from '@/app/lib/icons';

const meta: Meta<typeof StatCard> = {
  component: StatCard,
  title: 'UI/StatCard',
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    subtitle: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof StatCard>;

export const Default: Story = {
  args: {
    title: 'Gesamt Artikel',
    value: 42,
    subtitle: 'Im Vorrat',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Läuft bald ab',
    value: 5,
    subtitle: 'Nächste 7 Tage',
    icon: <Clock className="w-4 h-4 text-orange-600" />,
    valueClassName: 'text-2xl font-bold text-orange-600',
  },
};

export const DashboardStyle: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <StatCard
        title="Gesamt Artikel"
        value={12}
        subtitle="Im Vorrat"
        icon={<Package className="w-4 h-4 text-gray-600" />}
      />
      <StatCard
        title="Läuft bald ab"
        value={3}
        subtitle="Nächste 7 Tage"
        icon={<Clock className="w-4 h-4 text-orange-600" />}
        valueClassName="text-2xl font-bold text-orange-600"
      />
    </div>
  ),
};
