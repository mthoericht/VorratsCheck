import type { Meta, StoryObj } from '@storybook/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';

const meta: Meta<typeof Select> = {
  component: Select,
  title: 'UI/Select',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="select-category">Kategorie</Label>
      <Select defaultValue="gemuese">
        <SelectTrigger id="select-category">
          <SelectValue placeholder="Kategorie waehlen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gemuese">Gemuese</SelectItem>
          <SelectItem value="obst">Obst</SelectItem>
          <SelectItem value="konserve">Konserve</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Small: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="select-unit">Einheit</Label>
      <Select defaultValue="stk">
        <SelectTrigger id="select-unit" size="sm" aria-label="Einheit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stk">Stk</SelectItem>
          <SelectItem value="g">g</SelectItem>
          <SelectItem value="ml">ml</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-md bg-background p-4">
      <div className="grid w-full max-w-sm gap-2">
        <Label htmlFor="select-theme">Theme</Label>
        <Select defaultValue="system">
          <SelectTrigger id="select-theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Hell</SelectItem>
            <SelectItem value="dark">Dunkel</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};
