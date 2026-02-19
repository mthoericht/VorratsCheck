import type { Meta, StoryObj } from '@storybook/react';
import { Settings } from '../../../../src/app/pages/Settings';

const meta: Meta<typeof Settings> = {
  component: Settings,
  title: 'Pages/Settings',
  parameters: {
    router: { initialEntries: ['/settings'] },
  },
};

export default meta;

type Story = StoryObj<typeof Settings>;

export const Default: Story = {};
