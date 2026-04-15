'use client';
import { useEffect, useRef } from 'react';

const FOCUSABLE = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function ModalLayer({
  open,
  onClose,
  closeOnBackdrop = true,
  className = '',
  backdropClassName = 'bg-black/60 overscroll-contain',
  panelClassName = 'w-full min-w-0 flex justify-center max-h-full',
  children,
  'aria-labelledby': ariaLabelledby,
  'aria-label': ariaLabel,
}) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const root = panelRef.current;
      const nodes = [...root.querySelectorAll(FOCUSABLE)];
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !root.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    const raf = requestAnimationFrame(() => {
      const focusable = panelRef.current?.querySelector(FOCUSABLE);
      focusable?.focus?.();
    });
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(raf);
      if (
        prevActive &&
        typeof prevActive.focus === 'function' &&
        document.contains(prevActive)
      ) {
        prevActive.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  const handleBackdropMouseDown = (e) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${backdropClassName} ${className}`.trim()}
      onMouseDown={handleBackdropMouseDown}
      role="presentation"
    >
      <div
        ref={panelRef}
        className={panelClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledby}
        aria-label={ariaLabel}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
