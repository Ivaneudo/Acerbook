import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import {
  ToastCard,
  ToastCloseButton,
  ToastContent,
  ToastIconWrap,
  ToastMessage,
  ToastTitle,
  ToastViewport,
} from './ToastContainer.styles';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <ToastViewport aria-live="polite" aria-label="Notificações">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} variant={toast.variant} role="status">
          <ToastIconWrap variant={toast.variant}>
            {toast.variant === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <CheckCircle2 size={16} />
            )}
          </ToastIconWrap>

          <ToastContent>
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastMessage>{toast.message}</ToastMessage>
          </ToastContent>

          <ToastCloseButton
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Fechar notificação"
          >
            <X size={14} />
          </ToastCloseButton>
        </ToastCard>
      ))}
    </ToastViewport>
  );
};