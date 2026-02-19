import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BarcodeScanner } from '@/app/components/BarcodeScanner';

const meta: Meta<typeof BarcodeScanner> = {
  component: BarcodeScanner,
  title: 'Components/BarcodeScanner',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    autoStart: false,
  },
  argTypes: {
    autoStart: {
      description: 'Kamera beim Öffnen automatisch starten (in Storybook aus, um Kamera-Anfragen zu vermeiden)',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof BarcodeScanner>;

export const Default: Story = {
  args: { onScan: fn(), onClose: fn() },
};
