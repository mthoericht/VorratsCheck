import type { Meta, StoryObj } from '@storybook/react';
import { Route, Routes } from 'react-router';
import { Layout } from '@/app/components/Layout';
import { useAuthStore } from '@/app/stores/authStore';

const meta: Meta<typeof Layout> = {
  component: Layout,
  title: 'Components/Layout',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    router: { initialEntries: ['/'] },
  },
  decorators: [
    (Story) => 
    {
      useAuthStore.setState({
        user: { id: '1', email: 'user@example.com', username: 'Demo' },
      });
      return (
        <div className="min-h-screen">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof Layout>;

/** Uses the Storybook global MemoryRouter (see preview.tsx); Layout needs Outlet children via nested routes. */
export const Default: Story = {
  render: () => (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<div className="p-6">Dashboard-Inhalt (Outlet)</div>} />
      </Route>
    </Routes>
  ),
};
