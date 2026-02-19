import type { Meta, StoryObj } from '@storybook/react';
import { Login } from '../../../../src/app/pages/Login';

const meta: Meta<typeof Login> = {
  component: Login,
  title: 'Pages/Login',
};

export default meta;

type Story = StoryObj<typeof Login>;

export const Default: Story = {};
