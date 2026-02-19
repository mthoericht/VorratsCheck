import React, { useState } from 'react';
import { useInventoryStore } from '../stores/inventoryStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { BarcodeScanner } from '../components/BarcodeScanner';
import { Plus, Scan, Trash2, Pencil, AlertTriangle, MapPin } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useCategoriesStore } from '../stores/categoriesStore';
import { Link } from 'react-router';
import { FilterBar } from '../components/FilterBar';
import { Quantity } from '../components/Quantity';

export function Inventory() 
{
  const inventory = useInventoryStore((s) => s.items);
  const addInventoryItem = useInventoryStore((s) => s.add);
  const updateInventoryItem = useInventoryStore((s) => s.update);
  const deleteInventoryItem = useInventoryStore((s) => s.remove);
  const categories = useCategoriesStore((s) => s.items);
  const [showScanner, setShowScanner] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<typeof inventory[0] | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    barcode: '',
    quantity: '',
    unit: 'Stück',
    expiryDate: '',
    location: '',
  });

  const filterCategories = Array.from(new Set(inventory.map((item) => item.category)));
  const locations = Array.from(
    new Set(inventory.map((item) => item.location).filter((x): x is string => x != null && x !== ''))
  );
  const locationOptions = locations.map((loc) => ({ value: loc, label: loc }));

  const handleBarcodeScanned = (barcode: string) => 
  {
    setFormData(prev => ({ ...prev, barcode }));
    setShowScanner(false);
    setShowAddDialog(true);
    toast.success(`Barcode ${barcode} gescannt`);
  };

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    if (!formData.name || !formData.category) 
    {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }
    const parsedQty = formData.quantity.trim() ? parseFloat(formData.quantity) : NaN;
    const quantityVal = Number.isFinite(parsedQty) ? parsedQty : 1;
    const unitVal = formData.unit || 'Stück';
    try 
    {
      await addInventoryItem({
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        barcode: formData.barcode || undefined,
        quantity: quantityVal,
        unit: unitVal,
        expiryDate: formData.expiryDate || undefined,
        location: formData.location || undefined,
      });
      toast.success('Artikel hinzugefügt');
      setShowAddDialog(false);
      setFormData({ name: '', category: '', brand: '', barcode: '', quantity: '', unit: 'Stück', expiryDate: '', location: '' });
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
      await deleteInventoryItem(id);
      toast.success(`${name} wurde entfernt`);
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  const openEditDialog = (item: typeof inventory[0]) => 
  {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand ?? '',
      barcode: item.barcode ?? '',
      quantity: String(item.quantity),
      unit: item.unit,
      expiryDate: item.expiryDate ?? '',
      location: item.location ?? '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault();
    if (!editingItem || !formData.name || !formData.category) 
    {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }
    const parsedQty = formData.quantity.trim() ? parseFloat(formData.quantity) : NaN;
    const quantityVal = Number.isFinite(parsedQty) ? parsedQty : 1;
    const unitVal = formData.unit || 'Stück';
    try 
    {
      await updateInventoryItem(editingItem.id, {
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        barcode: formData.barcode || undefined,
        quantity: quantityVal,
        unit: unitVal,
        expiryDate: formData.expiryDate || undefined,
        location: formData.location || undefined,
      });
      toast.success('Artikel aktualisiert');
      setEditingItem(null);
    }
    catch (err) 
    {
      toast.error((err as Error).message);
    }
  };

  const getExpiryStatus = (expiryDate?: string) => 
  {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) 
    {
      return { status: 'expired', label: 'Abgelaufen', variant: 'destructive' as const };
    }
    else if (daysUntilExpiry <= 7) 
    {
      return { status: 'warning', label: `${daysUntilExpiry} Tage`, variant: 'outline' as const };
    }
    return { status: 'ok', label: `${daysUntilExpiry} Tage`, variant: 'secondary' as const };
  };

  const filteredInventory = inventory.filter((item) => 
  {
    const matchCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchLocation = filterLocation === 'all' || item.location === filterLocation;
    return matchCategory && matchLocation;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vorrat</h2>
          <p className="text-gray-600 mt-1">{inventory.length} Artikel im Vorrat</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowScanner(true)} variant="outline" className="gap-2">
            <Scan className="w-4 h-4" />
            Barcode scannen
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <Button
              className="gap-2"
              onClick={() =>
              {
                setFormData({ name: '', category: '', brand: '', barcode: '', quantity: '', unit: 'Stück', expiryDate: '', location: '' });
                setShowAddDialog(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Artikel hinzufügen
            </Button>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Neuer Artikel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Vollmilch"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Kategorie *</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          Keine Kategorien. <Link to="/categories" className="text-primary underline">Kategorien anlegen</Link>
                        </div>
                      ) : (
                        categories.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))
                      )}
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

                <div>
                  <Label htmlFor="barcode">Barcode</Label>
                  <div className="flex gap-2">
                    <Input
                      id="barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="Optional"
                    />
                    <Button type="button" variant="outline" onClick={() => 
                    {
                      setShowAddDialog(false);
                      setShowScanner(true);
                    }}>
                      <Scan className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Quantity
                  quantity={formData.quantity}
                  unit={formData.unit}
                  onQuantityChange={(value) => setFormData({ ...formData, quantity: value })}
                  onUnitChange={(value) => setFormData({ ...formData, unit: value })}
                  label="Menge"
                  placeholder="Optional (Standard: 1 Stück)"
                  optional
                  idPrefix="add"
                />

                <div>
                  <Label htmlFor="expiryDate">Mindesthaltbarkeitsdatum</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Lagerort</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Lagerort wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kühlschrank">Kühlschrank</SelectItem>
                      <SelectItem value="Gefrierschrank">Gefrierschrank</SelectItem>
                      <SelectItem value="Vorratsschrank">Vorratsschrank</SelectItem>
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

          {/* Edit Dialog */}
          <Dialog open={editingItem !== null} onOpenChange={(open) => { if (!open) setEditingItem(null); }}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Artikel bearbeiten</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Vollmilch"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="edit-category">Kategorie *</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                    required
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          Keine Kategorien. <Link to="/categories" className="text-primary underline">Kategorien anlegen</Link>
                        </div>
                      ) : (
                        categories.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-brand">Marke</Label>
                  <Input
                    id="edit-brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-barcode">Barcode</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-barcode"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="Optional"
                    />
                    <Button type="button" variant="outline" onClick={() => { setEditingItem(null); setShowScanner(true); }}>
                      <Scan className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Quantity
                  quantity={formData.quantity}
                  unit={formData.unit}
                  onQuantityChange={(value) => setFormData({ ...formData, quantity: value })}
                  onUnitChange={(value) => setFormData({ ...formData, unit: value })}
                  label="Menge"
                  placeholder="Optional (Standard: 1 Stück)"
                  optional
                  idPrefix="edit"
                />

                <div>
                  <Label htmlFor="edit-expiryDate">Mindesthaltbarkeitsdatum</Label>
                  <Input
                    id="edit-expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-location">Lagerort</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Lagerort wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kühlschrank">Kühlschrank</SelectItem>
                      <SelectItem value="Gefrierschrank">Gefrierschrank</SelectItem>
                      <SelectItem value="Vorratsschrank">Vorratsschrank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditingItem(null)} className="flex-1">
                    Abbrechen
                  </Button>
                  <Button type="submit" className="flex-1">
                    Speichern
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <FilterBar
          label="Lagerort"
          options={locationOptions}
          value={filterLocation}
          onChange={setFilterLocation}
          allLabel="Alle"
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="filter-category" className="text-sm font-medium text-muted-foreground shrink-0">
            Kategorie
          </Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger id="filter-category" className="w-[180px]" size="sm">
              <SelectValue placeholder="Alle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle</SelectItem>
              {filterCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventory.map(item => 
        {
          const expiryStatus = getExpiryStatus(item.expiryDate);
          
          return (
            <Card key={item.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.brand || item.category}</CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(item)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Bearbeiten"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Löschen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Menge:</span>
                  <span className="font-medium">{item.quantity} {item.unit}</span>
                </div>
                
                {item.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">MHD:</span>
                    <div className="flex items-center gap-2">
                      {expiryStatus?.status === 'expired' && (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      {expiryStatus?.status === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      )}
                      <Badge variant={expiryStatus?.variant}>
                        {expiryStatus?.label}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {item.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </div>
                )}
                
                {item.barcode && (
                  <div className="text-xs text-gray-500 font-mono">
                    Barcode: {item.barcode}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Keine Artikel gefunden</p>
          <Button
            className="mt-4"
            onClick={() =>
            {
              setFormData({ name: '', category: '', brand: '', barcode: '', quantity: '', unit: 'Stück', expiryDate: '', location: '' });
              setShowAddDialog(true);
            }}
          >
            Ersten Artikel hinzufügen
          </Button>
        </Card>
      )}

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}