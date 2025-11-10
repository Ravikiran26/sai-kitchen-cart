import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

const themes = [
  { value: 'earthy' as const, label: 'Earthy', description: 'Warm & Traditional' },
  { value: 'festive' as const, label: 'Festive', description: 'Vibrant & Celebratory' },
  { value: 'minimal' as const, label: 'Minimal', description: 'Clean & Modern' },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="transition-theme">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Switch theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="transition-theme">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={theme === t.value ? 'bg-accent' : ''}
          >
            <div className="flex flex-col">
              <span className="font-medium">{t.label}</span>
              <span className="text-xs text-muted-foreground">{t.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
