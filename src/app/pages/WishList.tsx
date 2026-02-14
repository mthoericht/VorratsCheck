import React, { useState } from 'react';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCategoriesStore } from '../stores/categoriesStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Plus, Trash2, Heart } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

export function WishList() 
{
  const wishList = useWishlistStore((s) => s.items);
  const addWishListItem = useWishlistStore((s) => s.add);
  const deleteWishListItem = useWishlistStore((s) => s.remove);
  const categories = useCategoriesStore((s) => s.items);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'category' as 'category' | 'specific',
    category: '',
    brand: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    if (!formData.name) 
    {
      toast.error('Bitte geben Sie einen Namen ein');
      return;
    }
    if (formData.type === 'category' && !formData.category) 
    {
      toast.error('Bitte wählen Sie eine Kategorie');
      return;
    }
    try 
    {
      await addWishListItem({
        name: formData.name,
        type: formData.type,
        category: formData.category || undefined,
        brand: formData.brand || undefined,
        priority: formData.priority,
      });
      toast.success('Artikel zur Wunschliste hinzugefügt');
      setShowAddDialog(false);
      setFormData({ name: '', type: 'category', category: '', brand: '', priority: 'medium' });
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
      await deleteWishListItem(id);
      toast.success(`${name} wurde entfernt`);
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => 
  {
    switch (priority) 
    {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityLabel = (priority: 'low' | 'medium' | 'high') => 
  {
    switch (priority) 
    {
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      case 'low': return 'Niedrig';
    }
  };

  const groupedByPriority = {
    high: wishList.filter(item => item.priority === 'high'),
    medium: wishList.filter(item => item.priority === 'medium'),
    low: wishList.filter(item => item.priority === 'low'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Wunschliste</h2>
          <p className="text-gray-600 mt-1">Artikel die Sie bei Gelegenheit kaufen möchten</p>
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
              <DialogTitle>Neuer Wunschlistenartikel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Typ</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as 'category' | 'specific' })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="category" id="category" />
                    <Label htmlFor="category" className="cursor-pointer">Kategorie</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specific" id="specific" />
                    <Label htmlFor="specific" className="cursor-pointer">Produktspezifisch</Label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-500 mt-1">
                  Kategorie: z.B. "Schokolade" | Produktspezifisch: z.B. "Lindt Excellence 85%"
                </p>
              </div>

              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={formData.type === 'category' ? 'z.B. Schokolade' : 'z.B. Lindt Excellence 85%'}
                  required
                />
              </div>

              {formData.type === 'category' && (
                <div>
                  <Label htmlFor="wishlist-category">Kategorie</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                    required
                  >
                    <SelectTrigger id="wishlist-category">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.type === 'specific' && (
                <>
                  <div>
                    <Label htmlFor="wishlist-category-opt">Kategorie (optional)</Label>
                    <Select
                      value={formData.category || 'none'}
                      onValueChange={(v) => setFormData({ ...formData, category: v === 'none' ? '' : v })}
                    >
                      <SelectTrigger id="wishlist-category-opt">
                        <SelectValue placeholder="Kategorie wählen" />
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
                  </div>
                  <div>
                    <Label htmlFor="brand">Marke</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Optional"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="priority">Priorität</Label>
                <Select value={formData.priority} onValueChange={(value: string) => setFormData({ ...formData, priority: value as 'low' | 'medium' | 'high' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Hoch</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="low">Niedrig</SelectItem>
                  </SelectContent>
                </Select>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Gesamt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wishList.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Hohe Priorität</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{groupedByPriority.high.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Mittlere Priorität</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{groupedByPriority.medium.length}</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Niedrige Priorität</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{groupedByPriority.low.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Wish List Items by Priority */}
      {(['high', 'medium', 'low'] as const).map(priority => (
        groupedByPriority[priority].length > 0 && (
          <div key={priority}>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge className={getPriorityColor(priority)}>
                {getPriorityLabel(priority)}
              </Badge>
              <span className="text-gray-600">({groupedByPriority[priority].length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedByPriority[priority].map(item => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-600" />
                          {item.name}
                        </CardTitle>
                        <CardDescription>
                          {item.type === 'category' ? 'Kategorie' : 'Produktspezifisch'}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id, item.name)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {item.category && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Kategorie:</span>
                        <span className="font-medium">{item.category}</span>
                      </div>
                    )}
                    
                    {item.brand && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Marke:</span>
                        <span className="font-medium">{item.brand}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Typ:</span>
                      <Badge variant="secondary">
                        {item.type === 'category' ? 'Allgemein' : 'Spezifisch'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      ))}

      {wishList.length === 0 && (
        <Card className="p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Keine Artikel auf der Wunschliste</p>
          <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
            Ersten Artikel hinzufügen
          </Button>
        </Card>
      )}
    </div>
  );
}
