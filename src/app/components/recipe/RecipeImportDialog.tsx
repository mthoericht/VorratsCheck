import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2 } from 'lucide-react';
import { importRecipe } from '../../lib/api/recipes';
import { useTranslation } from '../../lib/i18n';
import type { ImportedRecipe } from '../../lib/api/recipes';

interface RecipeImportDialogProps {
  trigger: React.ReactNode;
  onImported: (recipe: ImportedRecipe) => void;
}

/** Dialog to import a recipe from a URL (e.g. Chefkoch.de). */
export function RecipeImportDialog({ trigger, onImported }: RecipeImportDialogProps)
{
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) =>
  {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    try
    {
      const imported = await importRecipe(url.trim());
      setOpen(false);
      setUrl('');
      onImported(imported);
    }
    catch (err)
    {
      setError((err as Error).message || t('recipes.importError'));
    }
    finally
    {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setError(''); setUrl(''); } }}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('recipes.importTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="import-url">{t('recipes.importUrlLabel')}</Label>
            <Input
              id="import-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('recipes.importUrlPlaceholder')}
              required
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-1">
              {t('recipes.importHelp')}
            </p>
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !url.trim()}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? t('recipes.importing') : t('recipes.importButton')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
