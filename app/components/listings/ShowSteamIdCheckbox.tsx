import { colors } from '@/lib/colors';
import { motion } from 'motion/react';

interface ShowSteamIdCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ShowSteamIdCheckbox({
  checked,
  onChange,
}: ShowSteamIdCheckboxProps) {
  const isAnonymous = !checked;
  return (
    <div className="mb-6" style={{ color: colors.gray1 }}>
      <label className="flex items-center gap-2 cursor-pointer">
        <motion.input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => onChange(!e.target.checked)}
          whileHover={{
            boxShadow:
              '0 0 15px rgba(195, 194, 245, 0.4), 0 0 30px rgba(195, 194, 245, 0.2)',
          }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 border-2 appearance-none checked:bg-transparent cursor-pointer flex-shrink-0"
          style={{
            backgroundColor: 'transparent',
            borderColor: colors.purple,
            backgroundImage: isAnonymous
              ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='${encodeURIComponent(
                  colors.purple,
                )}' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`
              : 'none',
          }}
        />
        <span className="text-field-small">
          Post anonymously (hide my Steam ID)
        </span>
      </label>
    </div>
  );
}
