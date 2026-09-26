import { colors } from '@/lib/colors';
import { FieldError } from '@/components/ui/FieldError';

interface SteamIdInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isVerifying: boolean;
  isValid: boolean;
  isInvalid: boolean;
  error?: string;
}

export function SteamIdInput({
  value,
  onChange,
  onBlur,
  onKeyDown,
  isVerifying,
  isValid,
  isInvalid,
  error,
}: SteamIdInputProps) {
  const hasError = !!error;
  return (
    <div className="mb-6">
      <label htmlFor="steam-id" className="mb-4 md:mb-8 block text-field">
        Steam ID
      </label>
      <div className="flex items-center gap-3">
        <input
          id="steam-id"
          type="text"
          aria-invalid={hasError}
          aria-describedby="steam-id-hint"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder="Your Steam ID or profile link"
          className="flex-1 py-2 focus:outline-none border-b text-field bg-transparent"
          style={{
            borderColor: hasError ? colors.error : colors.white,
          }}
        />
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {isVerifying ? (
            <div
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ color: colors.purple }}
            ></div>
          ) : isValid ? (
            <img
              src="/SuccessfulCheck.svg"
              alt="Verified"
              className="w-5 h-5"
            />
          ) : isInvalid ? (
            <svg
              className="w-5 h-5"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L11 11M11 1L1 11"
                stroke={colors.error}
                strokeWidth="1.5"
              />
            </svg>
          ) : null}
        </div>
      </div>
      {error ? (
        <FieldError id="steam-id-hint" message={error} />
      ) : (
        <p
          id="steam-id-hint"
          className="text-field-small mt-2"
          style={{ color: colors.gray1 }}
        >
          17-digit ID, custom URL name or full profile link. Your game list and
          wishlist must be public to import.
        </p>
      )}
    </div>
  );
}
