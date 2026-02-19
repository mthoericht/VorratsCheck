import type { Meta, StoryObj } from '@storybook/react';
import { Signup } from '../../../../src/app/pages/Signup';

const meta: Meta<typeof Signup> = {
  component: Signup,
  title: 'Pages/Signup',
};

export default meta;

type Story = StoryObj<typeof Signup>;

export const Default: Story = {};
