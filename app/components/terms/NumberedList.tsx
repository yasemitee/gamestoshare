import { colors } from '@/lib/colors';

interface NumberedListProps {
  items: string[];
}

export function NumberedList({ items }: NumberedListProps) {
  return (
    <ol
      className="list-decimal list-inside space-y-4 text-field my-8"
      style={{ color: colors.purple }}
    >
      {items.map((item, index) => (
        <li key={index}>
          <span className="pl-4" style={{ color: colors.gray1 }}>
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}
