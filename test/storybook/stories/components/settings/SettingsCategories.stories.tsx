import type { Meta, StoryObj } from '@storybook/react';
import { SettingsCategories } from '@/app/components/settings/SettingsCategories';

const meta: Meta<typeof SettingsCategories> = {
  component: SettingsCategories,
  title: 'Components/settings/SettingsCategories',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof SettingsCategories>;

export const Default: Story = {};
