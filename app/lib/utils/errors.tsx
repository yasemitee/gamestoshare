'use client';

import toast from 'react-hot-toast';
import { colors } from '@/lib/colors';

/**
 * Centralized error handling utilities for toast notifications
 */

interface ToastOptions {
  duration?: number;
}

const DEFAULT_TOAST_STYLE = {
  background: colors.blue1,
  borderRadius: '0',
  fontSize: '12px',
  textTransform: 'none' as const,
};

/**
 * Show error toast for private Steam profile
 */
export function showPrivateProfileError(options?: ToastOptions) {
  toast.error(
    <div>
      <div style={{ color: colors.white }}>Private Profile Detected</div>
      <div style={{ color: colors.gray1 }}>
        Please set your Steam profile to public and try again.
      </div>
    </div>,
    {
      duration: options?.duration || 5000,
      style: DEFAULT_TOAST_STYLE,
    }
  );
}

/**
 * Show error toast for failed Steam verification
 */
export function showVerificationError(options?: ToastOptions) {
  toast.error(
    <div>
      <div style={{ color: colors.white }}>Verification Failed</div>
      <div style={{ color: colors.gray1 }}>
        Please ensure the code is in your Steam bio and try again.
      </div>
    </div>,
    {
      duration: options?.duration || 5000,
      style: DEFAULT_TOAST_STYLE,
    }
  );
}

/**
 * Show generic error toast
 */
export function showGenericError(options?: ToastOptions) {
  toast.error(
    <div>
      <div style={{ color: colors.white }}>Error</div>
      <div style={{ color: colors.gray1 }}>
        Something went wrong. Please try again.
      </div>
    </div>,
    {
      duration: options?.duration || 5000,
      style: DEFAULT_TOAST_STYLE,
    }
  );
}

/**
 * Show error toast for missing Steam ID
 */
export function showSteamIdNotFoundError(options?: ToastOptions) {
  toast.error(
    <div>
      <div style={{ color: colors.white }}>Steam ID Required</div>
      <div style={{ color: colors.gray1 }}>
        Please verify your Steam ID first.
      </div>
    </div>,
    {
      duration: options?.duration || 5000,
      style: DEFAULT_TOAST_STYLE,
    }
  );
}

/**
 * Setup global error handlers for backward compatibility
 * @deprecated Use direct function calls instead
 */
export function setupGlobalErrorHandlers() {
  if (typeof window !== 'undefined') {
    (window as any).showPrivateProfileError = showPrivateProfileError;
    (window as any).showVerificationError = showVerificationError;
    (window as any).showVerificationErrorGeneric = showGenericError;
    (window as any).showSteamIdNotFound = showSteamIdNotFoundError;
  }
}

/**
 * Cleanup global error handlers
 * @deprecated Use direct function calls instead
 */
export function cleanupGlobalErrorHandlers() {
  if (typeof window !== 'undefined') {
    delete (window as any).showPrivateProfileError;
    delete (window as any).showVerificationError;
    delete (window as any).showVerificationErrorGeneric;
    delete (window as any).showSteamIdNotFound;
  }
}
