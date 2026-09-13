'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const [isHovered, setIsHovered] = useState(false);
  const duration = toast.duration ?? 3800;
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (duration <= 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingTimeRef.current);
  }, [duration, onDismiss, toast.id]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    pauseTimer();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startTimer();
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-7 h-7 rounded-lg bg-[#238636]/20 border border-[#2ea043]/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-7 h-7 rounded-lg bg-[#d29922]/20 border border-[#d29922]/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-[#d29922]" />
          </div>
        );
      case 'error':
        return (
          <div className="w-7 h-7 rounded-lg bg-[#f85149]/20 border border-[#f85149]/30 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 text-[#f85149]" />
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-[#1f6feb]/20 border border-[#388bfd]/30 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-[#58a6ff]" />
          </div>
        );
    }
  };

  const getBorderAndGlow = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-[#2ea043]/40 shadow-lg shadow-green-950/40 hover:border-[#3fb950]/60';
      case 'warning':
        return 'border-[#d29922]/40 shadow-lg shadow-amber-950/40 hover:border-[#d29922]/60';
      case 'error':
        return 'border-[#f85149]/40 shadow-lg shadow-red-950/40 hover:border-[#f85149]/60';
      default:
        return 'border-[#388bfd]/40 shadow-lg shadow-blue-950/40 hover:border-[#58a6ff]/60';
    }
  };

  const getProgressBarColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-[#238636] to-[#3fb950]';
      case 'warning':
        return 'bg-gradient-to-r from-[#9e6a03] to-[#d29922]';
      case 'error':
        return 'bg-gradient-to-r from-[#da3633] to-[#f85149]';
      default:
        return 'bg-gradient-to-r from-[#1f6feb] to-[#58a6ff]';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.18, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative overflow-hidden rounded-xl bg-[#161b22]/95 backdrop-blur-xl border transition-colors ${getBorderAndGlow(
        toast.type
      )}`}
    >
      <div className="flex items-start gap-3 p-3.5">
        {getToastIcon(toast.type)}

        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[#f0f6fc] tracking-tight">{toast.title}</h4>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-md text-[#94a3b8] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors shrink-0 -mr-1 -mt-1"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {toast.description && (
            <p className="text-[11px] text-[#94a3b8] mt-0.5 leading-snug break-words">
              {toast.description}
            </p>
          )}

          {toast.action && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-[#21262d] hover:bg-[#30363d] text-[#58a6ff] border border-[#30363d] transition-all active:scale-95"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar Timer */}
      {duration > 0 && (
        <div className="h-0.5 w-full bg-[#21262d]">
          <div
            className={`h-full ${getProgressBarColor(toast.type)}`}
            style={{
              animation: `toastProgress ${duration}ms linear forwards`,
              animationPlayState: isHovered ? 'paused' : 'running',
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type = 'info', title, description, duration = 3800, action }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, description, duration, action };

      setToasts((prev) => [...prev.slice(-3), newToast]); // limit to maximum 4 active toasts
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
