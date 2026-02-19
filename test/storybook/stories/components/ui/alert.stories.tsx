import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';

const meta: Meta<typeof Alert> = {
  component: Alert,
  title: 'UI/Alert',
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['default', 'destructive'] } },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Hinweis</AlertTitle>
      <AlertDescription>Dies ist eine Standard-Alert-Nachricht.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTitle>Fehler</AlertTitle>
      <AlertDescription>Etwas ist schiefgelaufen.</AlertDescription>
    </Alert>
  ),
};
