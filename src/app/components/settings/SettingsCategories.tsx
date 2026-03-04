import React, { useState } from 'react';
import { useCategoriesStore } from '../../stores/categoriesStore';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Plus, Trash2, FolderOpen } from '@/app/lib/icons';
import { toast } from 'sonner';
import { useTranslation } from '../../lib/i18n';

export function SettingsCategories()
{
  const { t } = useTranslation();
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
      toast.error(t('settings.nameRequired'));
      return;
    }
    try
    {
      await addCategory(trimmed);
      toast.success(t('settings.categoryAdded'));
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
      toast.success(t('common.removed', { name }));
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
          <h3 className="text-xl font-semibold text-gray-900">{t('settings.categories')}</h3>
          <p className="text-gray-600 mt-1">
            {t('settings.categoriesDescription')}
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t('settings.addCategory')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('settings.newCategory')}</DialogTitle>
              <DialogDescription>{t('settings.newCategoryDescription')}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="categoryName">{t('common.name')}</Label>
                <Input
                  id="categoryName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('settings.categoryNamePlaceholder')}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  {t('common.cancel')}
                </Button>
                <Button type="submit" className="flex-1">
                  {t('common.add')}
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
            {t('settings.allCategories')}
          </CardTitle>
          <CardDescription>
            {t('settings.allCategoriesDescription')}
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
              {t('settings.noCategoriesEmpty')}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
