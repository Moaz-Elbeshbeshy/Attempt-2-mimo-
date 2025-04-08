"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export interface ToastContextState {
  toast: (props: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactElement<typeof ToastAction>;
    variant?: "default" | "destructive" | "success";
    duration?: number;
  }) => void;
}

export const ToastContext = createContext<ToastContextState | undefined>(
  undefined
);

interface ToasterProps {
  children?: React.ReactNode;
}

interface Toast {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement<typeof ToastAction>;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

let toastCount = 0;

export function ToastContextProvider({ children }: ToasterProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    ({
      title,
      description,
      action,
      variant,
      duration = 5000,
    }: {
      title?: React.ReactNode;
      description?: React.ReactNode;
      action?: React.ReactElement<typeof ToastAction>;
      variant?: "default" | "destructive" | "success";
      duration?: number;
    }) => {
      const id = `toast-${toastCount++}`;
      setToasts((prevToasts) => [
        { id, title, description, action, variant, duration },
        ...prevToasts,
      ]);

      return id;
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster toasts={toasts} setToasts={setToasts} />
    </ToastContext.Provider>
  );
}

function Toaster({
  toasts,
  setToasts,
}: {
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}) {
  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        duration,
      }) {
        return (
          <Toast
            key={id}
            variant={variant}
            onOpenChange={(open) => {
              if (!open) {
                setToasts((prevToasts) =>
                  prevToasts.filter((toast) => toast.id !== id)
                );
              }
            }}
            duration={duration}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}

export { Toaster };
