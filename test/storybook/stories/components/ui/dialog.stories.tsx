import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

const meta: Meta<typeof Dialog> = {
  component: Dialog,
  title: 'UI/Dialog',
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const OpenDialog: Story = {
  render: () => (
    <Dialog open={true} onOpenChange={() => undefined}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profil bearbeiten</DialogTitle>
          <DialogDescription>Aktualisiere deine Kontaktdaten.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="dialog-name">Name</Label>
            <Input id="dialog-name" defaultValue="Max Mustermann" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dialog-mail">E-Mail</Label>
            <Input id="dialog-mail" type="email" defaultValue="max@example.com" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Abbrechen</Button>
          <Button>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const OpenDialogDarkMode: Story = {
  render: () => (
    <div className="dark rounded-md bg-background p-4">
      <Dialog open={true} onOpenChange={() => undefined}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profil bearbeiten</DialogTitle>
            <DialogDescription>Aktualisiere deine Kontaktdaten.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="dialog-name-dark">Name</Label>
              <Input id="dialog-name-dark" defaultValue="Max Mustermann" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="dialog-mail-dark">E-Mail</Label>
              <Input id="dialog-mail-dark" type="email" defaultValue="max@example.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Abbrechen</Button>
            <Button>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
