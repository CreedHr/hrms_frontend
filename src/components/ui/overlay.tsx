import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const useEscape = (onClose: () => void): void => {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);
};

interface ModalProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md';
  labelledBy?: string;
}

export function Modal({ title, subtitle, open, onClose, children, footer, size = 'md' }: ModalProps) {
  useEscape(onClose);
  if (!open) return null;
  return createPortal(
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <div className="modal-wrap">
        <div
          className={cn('modal', size === 'sm' && 'sm')}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <header>
            <div>
              <h3>{title}</h3>
              {subtitle ? <p className="mut" style={{ fontSize: 12 }}>{subtitle}</p> : null}
            </div>
            <button className="x" onClick={onClose} aria-label="Close dialog">
              <X />
            </button>
          </header>
          {children}
          {footer ? <div className="form-actions">{footer}</div> : null}
        </div>
      </div>
    </>,
    document.body,
  );
}

interface DrawerProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}

export function Drawer({ title, subtitle, open, onClose, children, wide }: DrawerProps) {
  useEscape(onClose);
  if (!open) return null;
  return createPortal(
    <>
      <div className="scrim" onClick={onClose} aria-hidden="true" />
      <aside className={cn('drawer', wide && 'wide')} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <div>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button className="x" onClick={onClose} aria-label="Close panel">
            <X />
          </button>
        </header>
        {children}
      </aside>
    </>,
    document.body,
  );
}

export function ConfirmDialog({
  open,
  title = 'Delete record',
  body,
  confirmLabel = 'Delete',
  onConfirm,
  onClose,
}: {
  open: boolean;
  title?: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 13, lineHeight: 1.6 }}>{body}</p>
    </Modal>
  );
}
