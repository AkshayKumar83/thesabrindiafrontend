import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, LogOut, AlertTriangle, HelpCircle } from 'lucide-react';
import './ConfirmModal.css';

/**
 * ConfirmModal: a centered confirmation dialog for delete, logout, etc.
 *
 * Props
 *  open           boolean            show / hide
 *  variant        'danger' | 'logout' | 'warning' | 'default'   (sets icon + default texts)
 *  title          string             heading
 *  message        node               short explanation
 *  details        node               optional highlighted line, e.g. the item name
 *  icon           node               custom icon, e.g. <Trash2 size={28} />
 *  confirmText    string             confirm button label
 *  cancelText     string             cancel button label (default "Cancel")
 *  loading        boolean            show spinner and lock the dialog
 *  closeOnBackdrop boolean           click outside to cancel (default true)
 *  hideCancel     boolean            show only the confirm button
 *  onConfirm      () => void | Promise   if it returns a promise, the dialog shows a spinner until it settles
 *  onCancel       () => void         called on Cancel, Escape, or backdrop click
 */

const VARIANTS = {
  danger: { Icon: Trash2, title: 'Are you sure?', confirmText: 'Delete' },
  logout: { Icon: LogOut, title: 'Log out?', confirmText: 'Log out' },
  warning: { Icon: AlertTriangle, title: 'Please confirm', confirmText: 'Continue' },
  default: { Icon: HelpCircle, title: 'Please confirm', confirmText: 'Confirm' },
};

const ConfirmModal = ({
  open = false,
  variant = 'default',
  title,
  message,
  details,
  icon,
  confirmText,
  cancelText = 'Cancel',
  loading = false,
  closeOnBackdrop = true,
  hideCancel = false,
  onConfirm,
  onCancel,
}) => {
  const v = VARIANTS[variant] || VARIANTS.default;
  const [busy, setBusy] = useState(false);
  const isBusy = busy || loading;

  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const confirmRef = useRef(null);
  const latest = useRef({});
  latest.current = { onCancel, isBusy };

  useEffect(() => {
    if (!open) return undefined;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the safe option first (Cancel), so Enter never deletes by accident.
    (cancelRef.current || confirmRef.current)?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (!latest.current.isBusy) latest.current.onCancel?.();
        return;
      }
      if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll('button:not([disabled])');
        if (!nodes || !nodes.length) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [open]);

  if (!open || typeof document === 'undefined') return null;

  const handleConfirm = async () => {
    if (isBusy) return;
    try {
      const result = onConfirm?.();
      if (result && typeof result.then === 'function') {
        setBusy(true);
        await result;
      }
    } finally {
      setBusy(false);
    }
  };

  const Icon = v.Icon;

  return createPortal(
    <div
      className="scm-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && closeOnBackdrop && !isBusy) onCancel?.();
      }}
    >
      <div
        ref={dialogRef}
        className="scm-dialog"
        role={variant === 'danger' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby="scm-title"
        aria-describedby={message ? 'scm-message' : undefined}
        aria-busy={isBusy}
      >
        <div className="scm-border" aria-hidden="true" />

        <div className="scm-body">
          <div className="scm-icon" aria-hidden="true">
            {icon || <Icon size={28} strokeWidth={2} />}
          </div>

          <h2 id="scm-title" className="scm-title sabr-serif">
            {title || v.title}
          </h2>

          {message && (
            <p id="scm-message" className="scm-message">
              {message}
            </p>
          )}

          {details && <div className="scm-details">{details}</div>}

          <div className="scm-actions">
            {!hideCancel && (
              <button
                ref={cancelRef}
                type="button"
                className="scm-btn scm-btn--ghost"
                onClick={() => onCancel?.()}
                disabled={isBusy}
              >
                {cancelText}
              </button>
            )}
            <button
              ref={confirmRef}
              type="button"
              className="scm-btn scm-btn--solid"
              onClick={handleConfirm}
              disabled={isBusy}
            >
              {isBusy ? <span className="scm-spinner" aria-label="Please wait" /> : confirmText || v.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * useConfirm: ask for confirmation with one line of code.
 *
 *   const { confirm, modal } = useConfirm();
 *   const ok = await confirm({ variant: 'danger', title: 'Delete address?', message: '...' });
 *   if (ok) { ... }
 *   // and render {modal} once anywhere in your JSX
 */
export const useConfirm = () => {
  const [state, setState] = useState({ open: false });
  const resolver = useRef(null);

  const confirm = useCallback(
    (options = {}) =>
      new Promise((resolve) => {
        resolver.current?.(false); // settle any earlier pending request
        resolver.current = resolve;
        setState({ ...options, open: true });
      }),
    []
  );

  const close = (result) => {
    resolver.current?.(result);
    resolver.current = null;
    setState((s) => ({ ...s, open: false }));
  };

  const modal = (
    <ConfirmModal
        {...state}
        onCancel={() => close(false)}
        onConfirm={async () => {
        try {
            if (state.onConfirm) await state.onConfirm(); 
            close(true);
        } catch (error) {
            console.error('Confirm action failed:', error);
        }
        }}
    />
    );  

  return { confirm, modal };
};

export default ConfirmModal;