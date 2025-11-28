export const COUNTRIES = [
  { code: 'IT', name: 'Italy', emoji: '🇮🇹' },
  { code: 'US', name: 'United States', emoji: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', emoji: '🇬🇧' },
  { code: 'DE', name: 'Germany', emoji: '🇩🇪' },
  { code: 'FR', name: 'France', emoji: '🇫🇷' },
  { code: 'ES', name: 'Spain', emoji: '🇪🇸' },
  { code: 'NL', name: 'Netherlands', emoji: '🇳🇱' },
  { code: 'BE', name: 'Belgium', emoji: '🇧🇪' },
  { code: 'CH', name: 'Switzerland', emoji: '🇨🇭' },
  { code: 'AT', name: 'Austria', emoji: '🇦🇹' },
  { code: 'PL', name: 'Poland', emoji: '🇵🇱' },
  { code: 'SE', name: 'Sweden', emoji: '🇸🇪' },
  { code: 'NO', name: 'Norway', emoji: '🇳🇴' },
  { code: 'DK', name: 'Denmark', emoji: '🇩🇰' },
  { code: 'FI', name: 'Finland', emoji: '🇫🇮' },
  { code: 'PT', name: 'Portugal', emoji: '🇵🇹' },
  { code: 'GR', name: 'Greece', emoji: '🇬🇷' },
  { code: 'CZ', name: 'Czech Republic', emoji: '🇨🇿' },
  { code: 'HU', name: 'Hungary', emoji: '🇭🇺' },
  { code: 'RO', name: 'Romania', emoji: '🇷🇴' },
  { code: 'BG', name: 'Bulgaria', emoji: '🇧🇬' },
  { code: 'HR', name: 'Croatia', emoji: '🇭🇷' },
  { code: 'SK', name: 'Slovakia', emoji: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', emoji: '🇸🇮' },
  { code: 'IE', name: 'Ireland', emoji: '🇮🇪' },
  { code: 'LU', name: 'Luxembourg', emoji: '🇱🇺' },
  { code: 'CA', name: 'Canada', emoji: '🇨🇦' },
  { code: 'AU', name: 'Australia', emoji: '🇦🇺' },
  { code: 'NZ', name: 'New Zealand', emoji: '🇳🇿' },
  { code: 'JP', name: 'Japan', emoji: '🇯🇵' },
  { code: 'KR', name: 'South Korea', emoji: '🇰🇷' },
  { code: 'CN', name: 'China', emoji: '🇨🇳' },
  { code: 'BR', name: 'Brazil', emoji: '🇧🇷' },
  { code: 'MX', name: 'Mexico', emoji: '🇲🇽' },
  { code: 'AR', name: 'Argentina', emoji: '🇦🇷' },
  { code: 'CL', name: 'Chile', emoji: '🇨🇱' },
  { code: 'RU', name: 'Russia', emoji: '🇷🇺' },
  { code: 'UA', name: 'Ukraine', emoji: '🇺🇦' },
  { code: 'TR', name: 'Turkey', emoji: '🇹🇷' },
  { code: 'IN', name: 'India', emoji: '🇮🇳' },
  { code: 'SG', name: 'Singapore', emoji: '🇸🇬' },
  { code: 'MY', name: 'Malaysia', emoji: '🇲🇾' },
  { code: 'TH', name: 'Thailand', emoji: '🇹🇭' },
  { code: 'ID', name: 'Indonesia', emoji: '🇮🇩' },
  { code: 'PH', name: 'Philippines', emoji: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', emoji: '🇻🇳' },
  { code: 'ZA', name: 'South Africa', emoji: '🇿🇦' },
  { code: 'IL', name: 'Israel', emoji: '🇮🇱' },
  { code: 'AE', name: 'United Arab Emirates', emoji: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', emoji: '🇸🇦' },
] as const;

export type CountryCode = typeof COUNTRIES[number]['code'];

export function getCountryByCode(code: string) {
  return COUNTRIES.find(c => c.code === code.toUpperCase());
}

export function getCountryName(code: string): string {
  const country = getCountryByCode(code);
  return country ? `${country.emoji} ${country.code}` : code;
}
