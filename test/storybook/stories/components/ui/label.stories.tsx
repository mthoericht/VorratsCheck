import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@/app/components/ui/label';

const meta: Meta<typeof Label> = {
  component: Label,
  title: 'UI/Label',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: { children: 'Label' },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="label-demo">Name</Label>
      <input id="label-demo" className="rounded border px-3 py-1" placeholder="Name" />
    </div>
  ),
};
