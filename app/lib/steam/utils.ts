export function extractSteamId(url: string): string | null {
  const patterns = [
    /steamcommunity\.com\/profiles\/(\d{17})/,
    /steamcommunity\.com\/id\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function calculateAccountAge(createdTimestamp: number) {
  const now = new Date();
  const created = new Date(createdTimestamp * 1000);
  
  const totalMonths = 
    (now.getFullYear() - created.getFullYear()) * 12 + 
    (now.getMonth() - created.getMonth());
  
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return {
    years,
    months,
    totalMonths,
    createdAt: created,
  };
}

export function extractBioFromXML(xmlText: string): string | undefined {
  const summaryMatch = xmlText.match(/<summary><!\[CDATA\[(.*?)\]\]><\/summary>/);
  return summaryMatch ? summaryMatch[1] : undefined;
}

export function verifySecurityCode(bio: string | undefined, code: string): boolean {
  if (!bio) return false;
  return bio.includes(code);
}