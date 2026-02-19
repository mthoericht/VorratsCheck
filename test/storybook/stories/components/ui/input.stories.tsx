import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'UI/Input',
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Placeholder...' },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="input-demo">E-Mail</Label>
      <Input id="input-demo" {...args} />
    </div>
  ),
  args: { type: 'email', placeholder: 'name@beispiel.de' },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Passwort' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Deaktiviert' },
};
