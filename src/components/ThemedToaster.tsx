// src/components/ThemedToaster.tsx
import { Toaster } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      theme={isDark ? 'dark' : 'light'}
      position="bottom-right"
      richColors
    />
  );
}
