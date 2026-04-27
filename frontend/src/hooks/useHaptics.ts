"use client";

import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export function useHaptics() {
  const triggerHaptic = useCallback((type: HapticType = 'medium') => {
    // Placeholder for haptics - works on mobile devices with haptic engine
    // @ts-ignore
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      const patterns: Record<HapticType, number> = {
        light: 10,
        medium: 25,
        heavy: 50,
        success: 30,
        warning: 20,
        error: 50,
      };
      // @ts-ignore
      navigator.vibrate(patterns[type]);
    }
    
    // Also dispatch a custom event for UI feedback hooks
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('synch-haptic', { detail: { type } }));
    }
  }, []);

  return { triggerHaptic };
}

// Convenience hooks
export function useSyncHaptic() {
  const { triggerHaptic } = useHaptics();
  
  const onMatch = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const onSkip = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const onError = useCallback(() => triggerHaptic('error'), [triggerHaptic]);
  const onButton = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  
  return { onMatch, onSkip, onError, onButton, triggerHaptic };
}