import type { Meta, StoryObj } from '@storybook/react';
import { Layout } from '@/app/components/Layout';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { useAuthStore } from '@/app/stores/authStore';

function LayoutWithRouter() 
{
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: <div className="p-6">Dashboard-Inhalt (Outlet)</div> },
        ],
      },
    ],
    { initialEntries: ['/'], initialIndex: 0 }
  );
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof Layout> = {
  component: Layout,
  title: 'Components/Layout',
  tags: ['autodocs'],
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

export const Default: Story = {
  render: () => <LayoutWithRouter />,
};
