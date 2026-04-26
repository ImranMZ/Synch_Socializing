/**
 * Generates a DiceBear Toon-Head avatar URL based on a seed.
 * @param seed - The seed (usually a name or ID) to generate a unique avatar.
 * @returns The SVG URL for the avatar.
 */
export function getAvatarUrl(seed: string): string {
  // We use the toon-head style as requested by the user
  return `https://api.dicebear.com/9.x/toon-head/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}
