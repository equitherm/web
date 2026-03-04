// Toast wrapper for backward compatibility
// Maps old showToast API to Sonner

import { toast as sonnerToast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info', duration?: number) {
  const options = duration ? { duration } : undefined;

  switch (type) {
    case 'success':
      sonnerToast.success(message, options);
      break;
    case 'error':
      sonnerToast.error(message, options);
      break;
    case 'info':
    default:
      sonnerToast.info(message, options);
      break;
  }
}

// Re-export sonner's toast for new code
export { sonnerToast as toast };
