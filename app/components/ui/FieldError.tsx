import { colors } from '@/lib/colors';

/** Inline validation message, placed directly below the field it describes. */
export function FieldError({ message, id }: { message: string; id?: string }) {
  return (
    <p
      id={id}
      role="alert"
      data-field-error
      className="text-field-small mt-2"
      style={{ color: colors.errorText }}
    >
      {message}
    </p>
  );
}
