import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'UI/Card',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Kartentitel</CardTitle>
        <CardDescription>Optionale Beschreibung der Karte</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Inhalt der Karte.</p>
      </CardContent>
      <CardFooter>
        <Button>Aktion</Button>
      </CardFooter>
    </Card>
  ),
};

export const OnlyContent: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>Nur Inhalt ohne Header/Footer.</p>
      </CardContent>
    </Card>
  ),
};
