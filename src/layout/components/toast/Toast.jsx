import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import './Toast.css';

/**
 * Toast: themed messages that open in the center of the screen.
 *
 * 1. Wrap your app once:
 *      <ToastProvider position="center"> <App /> </ToastProvider>
 *    position: 'center' (default) | 'top-center' | 'bottom-center'
 *
 * 2. Use it anywhere:
 *      const toast = useToast();
 *      toast.success('Address deleted');
 *      toast.error('Could not delete address');
 *      toast.warning('Only 2 pieces left in stock', { title: 'Low stock' });
 *      toast.info('Order updates are sent by SMS', { duration: 6000 });
 *      toast.success('Saved', { duration: 0 });   // 0 = stays until closed
 */

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};
const TITLES = {
  success: 'Success',
  error: 'Something went wrong',
  warning: 'Please note',
  info: 'Info',
};
const DURATIONS = { success: 3500, info: 3500, warning: 4500, error: 5000 };
const MAX_VISIBLE = 3;
const EXIT_MS = 180;

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};

const ToastItem = ({ toast, onClose }) => {
  const [paused, setPaused] = useState(false);
  const remaining = useRef(toast.duration);
  const startedAt = useRef(0);
  const Icon = ICONS[toast.type] || Info;

  // Auto-dismiss timer that pauses while the user hovers or focuses the toast.
  useEffect(() => {
    if (paused || !toast.duration || toast.leaving) return undefined;
    startedAt.current = Date.now();
    const timer = setTimeout(() => onClose(toast.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, toast.duration, toast.leaving, toast.id, onClose]);

  return (
    <div
      className={`sct-toast sct-toast--${toast.type} ${toast.leaving ? 'is-leaving' : ''}`}
      role={toast.type === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="sct-icon" aria-hidden="true">
        <Icon size={20} strokeWidth={2.2} />
      </span>

      <div className="sct-text">
        <p className="sct-title">{toast.title || TITLES[toast.type]}</p>
        {toast.message && <p className="sct-message">{toast.message}</p>}
      </div>

      <button
        type="button"
        className="sct-close"
        aria-label="Dismiss message"
        onClick={() => onClose(toast.id)}
      >
        <X size={16} />
      </button>

      {toast.duration > 0 && (
        <span
          className="sct-progress"
          aria-hidden="true"
          style={{
            animationDuration: `${toast.duration}ms`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      )}
    </div>
  );
};

export const ToastProvider = ({ children, position = 'center' }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), EXIT_MS);
  }, []);

  const show = useCallback((type, message, options = {}) => {
    idRef.current += 1;
    const id = idRef.current;
    const toast = {
      id,
      type,
      message,
      title: options.title,
      duration: options.duration ?? DURATIONS[type],
    };
    setToasts((list) => [...list.slice(-(MAX_VISIBLE - 1)), toast]);
    return id;
  }, []);

  const api = useMemo(
    () => ({
      show,
      dismiss,
      success: (message, options) => show('success', message, options),
      error: (message, options) => show('error', message, options),
      warning: (message, options) => show('warning', message, options),
      info: (message, options) => show('info', message, options),
    }),
    [show, dismiss]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className={`sct-container sct-container--${position}`}>
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onClose={dismiss} />
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export default ToastProvider;