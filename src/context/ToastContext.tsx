'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  ArrowRight,
} from 'lucide-react';

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
  const startTimeRef = useRef<number>(0);
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
      const elapsed = startTimeRef.current > 0 ? Date.now() - startTimeRef.current : 0;
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

  // Toast theme configurations
  const themeConfig = {
    success: {
      accentColor: '#3fb950',
      glowColor: 'rgba(46,160,67,0.3)',
      borderColor: 'border-[#2ea043]/45 hover:border-[#3fb950]/70',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_24px_rgba(46,160,67,0.2)]',
      iconBg: 'bg-gradient-to-br from-[#238636]/30 to-[#2ea043]/15',
      iconBorder: 'border-[#2ea043]/50',
      iconColor: 'text-[#3fb950]',
      progressBg: 'bg-gradient-to-r from-[#238636] via-[#2ea043] to-[#3fb950]',
      progressGlow: '0 0 10px #3fb950',
      ribbonBg: 'bg-gradient-to-b from-[#3fb950] via-[#2ea043] to-[#238636]',
      badge: 'Success',
    },
    info: {
      accentColor: '#58a6ff',
      glowColor: 'rgba(56,139,253,0.3)',
      borderColor: 'border-[#388bfd]/45 hover:border-[#58a6ff]/70',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_24px_rgba(56,139,253,0.2)]',
      iconBg: 'bg-gradient-to-br from-[#1f6feb]/30 to-[#388bfd]/15',
      iconBorder: 'border-[#388bfd]/50',
      iconColor: 'text-[#58a6ff]',
      progressBg: 'bg-gradient-to-r from-[#1f6feb] via-[#388bfd] to-[#58a6ff]',
      progressGlow: '0 0 10px #58a6ff',
      ribbonBg: 'bg-gradient-to-b from-[#58a6ff] via-[#388bfd] to-[#1f6feb]',
      badge: 'Update',
    },
    warning: {
      accentColor: '#d29922',
      glowColor: 'rgba(210,153,34,0.3)',
      borderColor: 'border-[#d29922]/45 hover:border-[#e3b341]/70',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_24px_rgba(210,153,34,0.2)]',
      iconBg: 'bg-gradient-to-br from-[#9e6a03]/30 to-[#d29922]/15',
      iconBorder: 'border-[#d29922]/50',
      iconColor: 'text-[#e3b341]',
      progressBg: 'bg-gradient-to-r from-[#9e6a03] via-[#d29922] to-[#e3b341]',
      progressGlow: '0 0 10px #d29922',
      ribbonBg: 'bg-gradient-to-b from-[#e3b341] via-[#d29922] to-[#9e6a03]',
      badge: 'Notice',
    },
    error: {
      accentColor: '#f85149',
      glowColor: 'rgba(248,81,73,0.35)',
      borderColor: 'border-[#f85149]/50 hover:border-[#ff7b72]/80',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_28px_rgba(248,81,73,0.25)]',
      iconBg: 'bg-gradient-to-br from-[#da3633]/30 to-[#f85149]/15',
      iconBorder: 'border-[#f85149]/50',
      iconColor: 'text-[#ff7b72]',
      progressBg: 'bg-gradient-to-r from-[#da3633] via-[#f85149] to-[#ff7b72]',
      progressGlow: '0 0 10px #f85149',
      ribbonBg: 'bg-gradient-to-b from-[#ff7b72] via-[#f85149] to-[#da3633]',
      badge: 'Alert',
    },
  }[toast.type];

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className={`w-4 h-4 ${themeConfig.iconColor}`} />;
      case 'warning':
        return <AlertTriangle className={`w-4 h-4 ${themeConfig.iconColor}`} />;
      case 'error':
        return <AlertCircle className={`w-4 h-4 ${themeConfig.iconColor}`} />;
      default:
        return <Info className={`w-4 h-4 ${themeConfig.iconColor}`} />;
    }
  };

  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 140 }}
      dragElastic={{ left: 0.1, right: 0.7 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 80) {
          onDismiss(toast.id);
        }
      }}
      initial={{ opacity: 0, y: 35, scale: 0.9, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{
        opacity: 0,
        x: 120,
        scale: 0.85,
        filter: 'blur(4px)',
        transition: { duration: 0.2, ease: [0.32, 0, 0.67, 0] },
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 28, mass: 0.8 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto group relative overflow-hidden rounded-2xl bg-[#121620]/94 backdrop-blur-2xl border transition-all duration-200 cursor-grab active:cursor-grabbing ${themeConfig.borderColor} ${themeConfig.shadow}`}
      style={{
        boxShadow: `0 20px 50px rgba(0,0,0,0.65), 0 0 20px ${themeConfig.glowColor}, inset 0 1px 0 rgba(255,255,255,0.18)`,
      }}
    >
      {/* Radiant Atmospheric Corner Glow */}
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity"
        style={{ backgroundColor: themeConfig.accentColor }}
      />

      {/* Main Toast Content Layout */}
      <div className="flex items-start gap-3 p-3.5 relative z-10">
        {/* Left Glowing Accent Ribbon */}
        <div className={`w-1 self-stretch rounded-full shrink-0 ${themeConfig.ribbonBg}`} />

        {/* 3D Elevated Icon Badge with Entrance Spring */}
        <motion.div
          initial={{ scale: 0.6, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className={`w-8 h-8 rounded-xl ${themeConfig.iconBg} border ${themeConfig.iconBorder} flex items-center justify-center shrink-0 shadow-md shadow-black/40 mt-0.5`}
        >
          {renderIcon()}
        </motion.div>

        {/* Text Details & Actions */}
        <div className="flex-1 min-w-0 pt-0.5 pr-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs font-bold text-[#f0f6fc] tracking-tight leading-snug">
              {toast.title}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0 -mr-1 -mt-1">
              <span className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#8b949e] px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.06]">
                {themeConfig.badge}
              </span>
              <motion.button
                type="button"
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(toast.id);
                }}
                className="p-1 rounded-lg text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/[0.08] transition-colors"
                title="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {toast.description && (
            <p className="text-[11.5px] text-[#94a3b8] mt-1 leading-snug break-words">
              {toast.description}
            </p>
          )}

          {toast.action && (
            <div className="mt-2.5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03, x: 2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-[#58a6ff] hover:text-white border border-[#58a6ff]/40 shadow-sm transition-all"
              >
                <span>{toast.action.label}</span>
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Hairline Glowing Laser Progress Bar */}
      {duration > 0 && (
        <div className="h-[2.5px] w-full bg-white/[0.06] relative overflow-hidden">
          <div
            className={`h-full ${themeConfig.progressBg}`}
            style={{
              boxShadow: themeConfig.progressGlow,
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

      setToasts((prev) => [...prev.slice(-3), newToast]); // Limit to maximum 4 active toasts
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Floating Toast Notification Container with Clean Stacking */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-[400px] w-full pointer-events-none px-4 sm:px-0"
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
