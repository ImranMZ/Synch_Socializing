/**
 * Generates a DiceBear Toon-Head avatar URL based on a seed.
 * @param seed - The seed (usually a name or ID) to generate a unique avatar.
 * @returns The SVG URL for the avatar.
 */
export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/toon-head/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/**
 * Formats a date to relative time (e.g., "2h ago", "3d ago")
 * @param date - The date to format
 * @returns Relative time string
 */
export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 4) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return then.toLocaleDateString();
}

/**
 * Calculate profile completeness percentage
 * @param user - User object
 * @returns Completeness percentage (0-100)
 */
export function getProfileCompleteness(user: Record<string, unknown>): number {
  const fields = ['name', 'avatar', 'gender', 'age', 'city', 'vibe', 'hobbies'];
  let filled = 0;
  fields.forEach(field => {
    if (user[field]) filled++;
  });
  return Math.round((filled / fields.length) * 100);
}

/**
 * Validate name (min 2 characters)
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

/**
 * Validate age (18-99)
 */
export function isValidAge(age: number): boolean {
  return age >= 18 && age <= 99;
}