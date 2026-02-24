import type { Meta, StoryObj } from '@storybook/react';
import { SettingsLanguage } from '@/app/components/settings/SettingsLanguage';

const meta: Meta<typeof SettingsLanguage> = {
  component: SettingsLanguage,
  title: 'Components/settings/SettingsLanguage',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SettingsLanguage>;

export const Default: Story = {};
