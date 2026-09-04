export interface ToastMessage {
  id: string;
  type: 'offline' | 'online' | 'sync' | 'success' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

type ToastListener = (toasts: ToastMessage[]) => void;

class ToastService {
  private toasts: ToastMessage[] = [];
  private listeners: ToastListener[] = [];

  public show(toast: Omit<ToastMessage, 'id'>): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = {
      id,
      duration: toast.duration ?? 4500,
      ...toast,
    };
    this.toasts = [newToast, ...this.toasts].slice(0, 5); // Keep max 5 toasts visible
    this.notify();

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duration);
    }
    return id;
  }

  public success(message: string, title: string = 'Success'): string {
    return this.show({ type: 'success', title, message });
  }

  public info(message: string, title: string = 'Notice'): string {
    return this.show({ type: 'info', title, message });
  }

  public warning(message: string, title: string = 'Warning'): string {
    return this.show({ type: 'warning', title, message });
  }

  public error(message: string, title: string = 'Error'): string {
    return this.show({ type: 'warning', title, message });
  }

  public dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public clearAll() {
    this.toasts = [];
    this.notify();
  }

  public subscribe(listener: ToastListener) {
    this.listeners.push(listener);
    listener(this.toasts);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.toasts));
  }
}

export const toastService = new ToastService();
