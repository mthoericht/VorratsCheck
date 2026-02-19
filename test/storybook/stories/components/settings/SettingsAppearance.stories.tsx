import type { Meta, StoryObj } from '@storybook/react';
import { SettingsAppearance } from '@/app/components/settings/SettingsAppearance';

const meta: Meta<typeof SettingsAppearance> = {
  component: SettingsAppearance,
  title: 'Components/settings/SettingsAppearance',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SettingsAppearance>;

export const Default: Story = {};
