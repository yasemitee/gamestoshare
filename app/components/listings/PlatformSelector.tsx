import { colors } from '@/lib/colors';

interface PlatformSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PlatformSelector({
  value,
  onChange,
  disabled = false,
}: PlatformSelectorProps) {
  return (
    <div className="relative">
      <label className="block mb-6 text-field">Platform</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-4 text-small-title appearance-none pr-10"
        style={{ background: colors.blue1, color: colors.gray2 }}
        disabled={disabled}
      >
        <option value="STEAM">STEAM</option>
      </select>
      <div className="absolute right-4 top-[60px] pointer-events-none opacity-40">
        <img src="/Dropdown.svg" alt="" width={10} height={6} />
      </div>
    </div>
  );
}
