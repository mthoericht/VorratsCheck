import type { Meta, StoryObj } from '@storybook/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { RouteErrorBoundary } from '@/app/components/RouteErrorBoundary';

function RouterWithError({ message }: { message: string }) 
{
  const router = createMemoryRouter(
    [
      {
        path: '/',
        id: 'root',
        errorElement: <RouteErrorBoundary />,
        loader: () => 
        {
          throw new Error(message);
        },
        element: null,
      },
    ],
    { initialEntries: ['/'], initialIndex: 0 }
  );
  return <RouterProvider router={router} />;
}

const meta: Meta<typeof RouteErrorBoundary> = {
  component: RouteErrorBoundary,
  title: 'Components/RouteErrorBoundary',
  tags: ['autodocs'],
  parameters: {
    reactRouter: { routePath: '/' },
  },
};

export default meta;

type Story = StoryObj<typeof RouteErrorBoundary>;

export const GenericError: Story = {
  render: () => <RouterWithError message="Eine Testfehlermeldung" />,
};
