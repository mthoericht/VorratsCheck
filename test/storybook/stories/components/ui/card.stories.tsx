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

export const DarkMode: Story = {
  render: () => (
    <div className="dark rounded-md bg-background p-4">
      <Card>
        <CardHeader>
          <CardTitle>Dunkles Kartenbeispiel</CardTitle>
          <CardDescription>Test fuer Kontrast und Lesbarkeit</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Inhalt in Dark-Mode Umgebung.</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">Aktion</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
