// src/components/Toast/Toast.tsx
import { useState, useCallback } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

type ShowToastFn = (message: string, type?: ToastType, duration?: number) => void;

let toastId = 0;
let showToastFn: ShowToastFn | null = null;

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  showToastFn = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function showToast(message: string, type?: ToastType, duration?: number) {
  if (showToastFn) {
    showToastFn(message, type, duration);
  }
}
