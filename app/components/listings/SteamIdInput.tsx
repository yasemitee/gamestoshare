import { colors } from '@/lib/colors';

interface SteamIdInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  isVerifying: boolean;
  isValid: boolean;
  isInvalid: boolean;
}

export function SteamIdInput({
  value,
  onChange,
  onBlur,
  isVerifying,
  isValid,
  isInvalid,
}: SteamIdInputProps) {
  return (
    <div className="mb-6">
      <label className="pb-8 block text-field">Steam ID</label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="Your Steam ID"
          className="flex-1 py-2 focus:outline-none border-b border-white text-field bg-transparent"
          style={{
            caretColor: colors.gray2,
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
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L14 14M14 6L6 14"
                stroke={colors.red}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : null}
        </div>
      </div>
    </div>
  );
}
