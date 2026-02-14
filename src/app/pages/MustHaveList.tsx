import React, { useState } from 'react';
import { useMustHaveStore } from '../stores/mustHaveStore';
import { useInventoryStore } from '../stores/inventoryStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useCategoriesStore } from '../stores/categoriesStore';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

export function MustHaveList() 
{
  const mustHaveList = useMustHaveStore((s) => s.items);
  const addMustHaveItem = useMustHaveStore((s) => s.add);
  const deleteMustHaveItem = useMustHaveStore((s) => s.remove);
  const inventory = useInventoryStore((s) => s.items);
  const categories = useCategoriesStore((s) => s.items);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    minQuantity: '',
  });

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    if (!formData.name || !formData.minQuantity) 
    {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }
    try 
    {
      await addMustHaveItem({
        name: formData.name.trim(),
        category: formData.category.trim() || undefined,
        minQuantity: parseInt(formData.minQuantity, 10) || 1,
      });
      toast.success('Must-Have Artikel hinzugefügt');
      setShowAddDialog(false);
      setFormData({ name: '', category: '', minQuantity: '' });
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
      await deleteMustHaveItem(id);
      toast.success(`${name} wurde entfernt`);
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  const getStockStatus = (mustHave: { name: string; minQuantity: number }) => 
  {
    const inventoryItems = inventory.filter((item) =>
      item.name.toLowerCase().includes(mustHave.name.toLowerCase())
    );
    const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      current: totalQuantity,
      needed: mustHave.minQuantity,
      isLow: totalQuantity < mustHave.minQuantity,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Must-Have Liste</h2>
          <p className="text-gray-600 mt-1">Lebensmittel die immer verfügbar sein sollten</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Artikel hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuer Must-Have Artikel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Butter, Milch, Eier, Nudeln"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Wird mit dem Namen der Vorratsartikel abgeglichen (z.B. „Butter“)
                </p>
              </div>

              <div>
                <Label htmlFor="category">Kategorie</Label>
                <Select
                  value={formData.category || 'none'}
                  onValueChange={(v) => setFormData({ ...formData, category: v === 'none' ? '' : v })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Kategorie wählen (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  Optionale Einordnung (wird nur zur Anzeige genutzt)
                </p>
              </div>

              <div>
                <Label htmlFor="minQuantity">Minimale Menge</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  step="0.01"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                  placeholder="z.B. 1, 6, 500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Die Mindestmenge, die immer vorhanden sein sollte
                </p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gesamt Artikel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mustHaveList.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ausreichend vorrätig</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mustHaveList.filter(item => !getStockStatus(item).isLow).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nachkaufen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mustHaveList.filter(item => getStockStatus(item).isLow).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Must-Have List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mustHaveList.map(item => 
        {
          const status = getStockStatus(item);
          
          return (
            <Card key={item.id} className={status.isLow ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {status.isLow ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {item.name}
                    </CardTitle>
                    <CardDescription>
                      {item.category && <span className="text-muted-foreground">{item.category}</span>}
                      {item.category && ' · '}
                      {status.isLow ? 'Nachkaufen erforderlich' : 'Ausreichend vorhanden'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Aktueller Bestand:</span>
                  <Badge variant={status.isLow ? 'destructive' : 'default'}>
                    {status.current} / {status.needed}
                  </Badge>
                </div>
                
                {status.isLow && (
                  <div className="text-sm text-red-600 font-medium">
                    Noch {Math.max(0, status.needed - status.current)} benötigt
                  </div>
                )}

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status.isLow ? 'bg-red-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(100, (status.current / status.needed) * 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {mustHaveList.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Keine Must-Have Artikel definiert</p>
          <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
            Ersten Artikel hinzufügen
          </Button>
        </Card>
      )}
    </div>
  );
}
