import React, { useState } from 'react';
import { useCategoriesStore } from '../stores/categoriesStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../components/ui/dialog';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

export function Categories() 
{
  const categories = useCategoriesStore((s) => s.items);
  const addCategory = useCategoriesStore((s) => s.add);
  const removeCategory = useCategoriesStore((s) => s.remove);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) 
    {
      toast.error('Bitte einen Namen eingeben');
      return;
    }
    try 
    {
      await addCategory(trimmed);
      toast.success('Kategorie hinzugefügt');
      setShowAddDialog(false);
      setNewName('');
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string) => 
  {
    try 
    {
      await removeCategory(id);
      toast.success(`${name} wurde entfernt`);
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Kategorien</h3>
          <p className="text-gray-600 mt-1">
            Kategorien verwalten – werden in Vorrat, Must-Have und Wunschliste zur Auswahl genutzt
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Kategorie hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Kategorie</DialogTitle>
              <DialogDescription>Name der Kategorie (z.B. Milchprodukte, Getränke)</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="categoryName">Name</Label>
                <Input
                  id="categoryName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="z.B. Milchprodukte"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Abbrechen
                </Button>
                <Button type="submit" className="flex-1">
                  Hinzufügen
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Alle Kategorien
          </CardTitle>
          <CardDescription>
            Diese Kategorien stehen in den Listen zur Auswahl. Doppelte Namen sind nicht erlaubt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between rounded-lg border px-4 py-3 bg-card"
              >
                <span className="font-medium">{cat.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          {categories.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              Noch keine Kategorien. Kategorien anlegen, um sie in Vorrat, Must-Have und Wunschliste auswählen zu können.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
