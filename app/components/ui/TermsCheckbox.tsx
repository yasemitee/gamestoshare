'use client';

import Link from 'next/link';
import { colors } from '@/lib/colors';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  hasError?: boolean;
}

export function TermsCheckbox({
  checked,
  onChange,
  hasError = false,
}: TermsCheckboxProps) {
  return (
    <div className="mb-8 mx-auto max-w-xl" style={{ color: colors.gray1 }}>
      <label className="flex items-center justify-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 border-2 appearance-none checked:bg-transparent cursor-pointer flex-shrink-0"
          style={{
            backgroundColor: 'transparent',
            borderColor: hasError ? colors.error : colors.purple,
            backgroundImage: checked
              ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${encodeURIComponent(
                  colors.purple
                )}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
              : 'none',
          }}
        />
        <span className="text-field-small">
          I have read and agree to the{' '}
          <Link href="/terms" className="underline">
            terms and conditions
          </Link>
          .
        </span>
      </label>
    </div>
  );
}
