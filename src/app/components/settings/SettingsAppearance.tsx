import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Sun, Moon, Palette, Monitor } from 'lucide-react';

const options = [
  { value: 'system', label: 'Automatisch', icon: Monitor },
  { value: 'light', label: 'Hell', icon: Sun },
  { value: 'dark', label: 'Dunkel', icon: Moon },
] as const;

export function SettingsAppearance()
{
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Erscheinungsbild</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Wähle das Design: Automatisch (System), Hell oder Dunkel
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Design
          </CardTitle>
          <CardDescription>
            Automatisch übernimmt die Systemeinstellung, Hell und Dunkel erzwingen den jeweiligen Modus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="theme">Modus</Label>
            <Select
              value={theme ?? 'light'}
              onValueChange={(value) => setTheme(value)}
            >
              <SelectTrigger id="theme" className="w-full max-w-xs">
                <SelectValue placeholder="Modus wählen" />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) =>
                {
                  const Icon = opt.icon;
                  return (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {opt.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
