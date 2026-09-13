'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflow } from '../../context/WorkflowContext';
import { useToast } from '../../context/ToastContext';
import { MARKETPLACE_ACTIONS } from '../../data/marketplaceData';
import { MarketplaceAction } from '../../types/workflow';
import {
  Store,
  X,
  Search,
  Plus,
  Check,
  ExternalLink,
  Shield,
  Bell,
  Code2,
  Cloud,
  Tag,
  KeyRound,
  Sparkles,
} from 'lucide-react';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryFilter = 'all' | 'notifications' | 'quality' | 'security' | 'cloud' | 'releases';

export const MarketplaceModal: React.FC<MarketplaceModalProps> = ({ isOpen, onClose }) => {
  const { addStep } = useWorkflow();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories = [
    { id: 'all', label: 'All Actions', icon: <Store className="w-3.5 h-3.5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-3.5 h-3.5 text-[#3fb950]" /> },
    { id: 'quality', label: 'Code Quality', icon: <Code2 className="w-3.5 h-3.5 text-[#58a6ff]" /> },
    { id: 'security', label: 'Security & Scanners', icon: <Shield className="w-3.5 h-3.5 text-[#f85149]" /> },
    { id: 'cloud', label: 'Cloud & DevOps', icon: <Cloud className="w-3.5 h-3.5 text-[#a371f7]" /> },
    { id: 'releases', label: 'Releases', icon: <Tag className="w-3.5 h-3.5 text-[#f0883e]" /> },
  ];

  const filteredActions = useMemo(() => {
    return MARKETPLACE_ACTIONS.filter((action) => {
      const matchesCategory =
        selectedCategory === 'all' || action.category === selectedCategory;
      const matchesSearch =
        action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.uses.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleAddAction = (action: MarketplaceAction) => {
    addStep({
      name: action.name,
      uses: action.uses,
      with: action.with,
      env: action.env || [],
      ifCondition: action.ifCondition,
    });

    setAddedIds((prev) => new Set([...prev, action.id]));

    showToast({
      type: 'success',
      title: `Added "${action.name}" to Pipeline!`,
      description: action.requiredSecrets?.length
        ? `Registered required secret: ${action.requiredSecrets.map((s) => s.name).join(', ')}`
        : 'Step added to your pipeline sequence.',
    });

    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(action.id);
        return next;
      });
    }, 2500);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative w-full max-w-4xl rounded-2xl bg-[#161b22]/95 border border-white/[0.12] shadow-[0_24px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl overflow-hidden z-10 flex flex-col h-[85vh] max-h-[820px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0d1117]/60">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f0883e]/15 border border-[#f0883e]/30 text-[#f0883e] shadow-sm">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#f0f6fc]">GitHub Actions Marketplace</h3>
                <p className="text-xs text-[#8b949e]">
                  Browse verified community actions for notifications, security scanning, quality gates, and deployments.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#8b949e] hover:text-[#f0f6fc] hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="px-6 py-3 border-b border-white/[0.08] bg-[#121620]/60 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actions by name, keyword, or uses path (e.g. slack, codecov, snyk)..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#0d1117]/80 border border-white/[0.09] rounded-xl text-[#f0f6fc] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#388bfd]/20 border border-[#388bfd] text-[#58a6ff] shadow-sm'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] text-[#8b949e] hover:text-[#f0f6fc]'
                    }`}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions Grid */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredActions.map((action) => {
                const isAdded = addedIds.has(action.id);
                return (
                  <motion.div
                    key={action.id}
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="p-4 rounded-2xl bg-[#0d1117]/80 border border-white/[0.08] hover:border-[#58a6ff]/40 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#f0f6fc]">{action.name}</h4>
                            {action.badge && (
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-[#f0883e]/20 text-[#ffa657] border border-[#f0883e]/30">
                                {action.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#58a6ff] break-all">
                            {action.uses}
                          </span>
                        </div>

                        {action.documentationUrl && (
                          <a
                            href={action.documentationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#8b949e] hover:text-[#58a6ff] transition-colors p-1"
                            title="View Action Documentation"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <p className="text-[11px] text-[#8b949e] leading-snug">
                        {action.description}
                      </p>

                      {/* Required Secrets Badge */}
                      {action.requiredSecrets && action.requiredSecrets.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] text-[#6e7681] flex items-center gap-1">
                            <KeyRound className="w-3 h-3 text-[#d29922]" />
                            Requires Secret:
                          </span>
                          {action.requiredSecrets.map((sec) => (
                            <span
                              key={sec.name}
                              className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#d29922]/15 text-[#e3b341] border border-[#d29922]/30"
                            >
                              {sec.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[10px] text-[#6e7681] capitalize">
                        Category: {action.category}
                      </span>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleAddAction(action)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                          isAdded
                            ? 'bg-[#238636] text-white border border-[#2ea043]'
                            : 'bg-white/[0.06] hover:bg-[#388bfd] text-[#f0f6fc] hover:text-white border border-white/[0.1] hover:border-[#58a6ff]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Pipeline</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredActions.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <p className="text-xs font-semibold text-[#f0f6fc]">No marketplace actions found</p>
                <p className="text-[11px] text-[#8b949e]">
                  Try searching with different keywords like "slack", "coverage", or "security".
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-white/[0.08] bg-[#0d1117]/60 text-xs text-[#8b949e]">
            <span>Showing {filteredActions.length} curated actions</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#f0f6fc] border border-white/[0.08] transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
