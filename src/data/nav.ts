/**
 * Single source of truth for site navigation.
 * Every header (desktop lists and the shared MobileMenu) reads from here so the
 * label/route pairs can never drift apart between pages.
 */
export interface NavItem {
  label: string
  to: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Story', to: '/story' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Skills', to: '/skills' },
  { label: 'Message', to: '/message' },
] as const

export interface SocialLink {
  label: string
  url: string
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: 'Instagram', url: 'https://www.instagram.com/kingzconnectng' },
  { label: 'TikTok', url: 'https://tiktok.com/@kingzconnect' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ndukwe-kalu-a3295b39b' },
] as const
