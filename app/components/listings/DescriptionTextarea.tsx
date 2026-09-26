'use client';

import { colors } from '@/lib/colors';

interface DescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function DescriptionTextarea({
  value,
  onChange,
  placeholder = 'What are you looking for in a Family Sharing partner? Languages, play times, anything else.',
  maxLength = 500,
}: DescriptionTextareaProps) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor="listing-description"
        className="text-field mb-4 md:mb-11"
        style={{ color: colors.white }}
      >
        Description
      </label>
      <textarea
        id="listing-description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full text-field-small resize-none border-b min-h-[88px] md:min-h-[220px]"
        style={{
          color: colors.gray1,
          outline: 'none',
        }}
      />
      <div
        className="text-field-small mt-2 text-right"
        style={{ color: colors.gray1 }}
      >
        {value.length}/{maxLength}
      </div>
    </div>
  );
}
