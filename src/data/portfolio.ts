/**
 * Single source of truth for the /jobs page.
 *
 * A project can belong to several categories (see `categories`) — it is listed
 * once here and rendered in every matching section, so no data is duplicated.
 *
 * Fields marked `TODO` are placeholders and need real values (live URLs,
 * confirmed stack) before this goes out the door.
 */

export type ProjectStatus = 'live' | 'in-progress' | 'private'
export type ProjectType = 'client' | 'personal'

export type CategoryId = 'web' | 'ecommerce' | 'digital-products' | 'mobile' | 'data'

export interface ProjectStack {
  frontend: string[]
  backend: string[]
  platform: string[]
  tools: string[]
}

export interface PortfolioProject {
  id: string
  name: string
  /** One line, shown on the card (max 2 lines, clamped). */
  description: string
  /** 2–4 sentences, shown in the detail modal. */
  longDescription: string
  year: number
  status: ProjectStatus
  type: ProjectType
  categories: CategoryId[]
  /** Live URL. Empty string renders no "VISIT" link. */
  url: string
  /** Repository URL. Empty string hides the "View source" button. */
  repo: string
  /** Paths under /public. First entry is the cover. */
  images: string[]
  stack: ProjectStack
}

export interface WorkCategory {
  id: CategoryId
  title: string
  role: string
  /** Short label used by the filter bar. */
  filterLabel: string
}

export const workCategories: WorkCategory[] = [
  { id: 'web', title: 'WEB DEVELOPMENT', role: 'WEB DEVELOPER', filterLabel: 'WEB' },
  { id: 'ecommerce', title: 'E-COMMERCE', role: 'WEB & E-COMMERCE DEVELOPER', filterLabel: 'E-COMMERCE' },
  { id: 'digital-products', title: 'DIGITAL PRODUCTS', role: 'PRODUCT DEVELOPER', filterLabel: 'PRODUCTS' },
  { id: 'mobile', title: 'MOBILE APPLICATIONS', role: 'MOBILE APP DEVELOPER', filterLabel: 'MOBILE' },
  { id: 'data', title: 'DATA & INTELLIGENT SYSTEMS', role: 'APPLICATION & DATA SYSTEMS DEVELOPER', filterLabel: 'DATA' },
]

export const statusLabels: Record<ProjectStatus, string> = {
  live: 'LIVE',
  'in-progress': 'IN PROGRESS',
  private: 'PRIVATE / NDA',
}

export const typeLabels: Record<ProjectType, string> = {
  client: 'CLIENT WORK',
  personal: 'PERSONAL',
}

export const stackGroupLabels: Record<keyof ProjectStack, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  platform: 'Platform / CMS',
  tools: 'Tools / APIs',
}

export const stackGroupOrder: (keyof ProjectStack)[] = ['frontend', 'backend', 'platform', 'tools']

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'cultur-fm',
    name: 'Cultur FM',
    description: 'Official Cultur FM website for events and shows.',
    // TODO: add what the build involved.
    longDescription:
      'The official Cultur FM website, covering events, shows and the station\u2019s programming. Built to put events and schedules front and centre and keep the audience up to date.',
    year: 2024, // TODO: confirm year
    status: 'live',
    type: 'client',
    categories: ['web'],
    url: '', // TODO: add the live site URL
    repo: '',
    images: ['/projects/cultur-fm/cover.png'], // TODO: replace with a real capture
    stack: {
      frontend: [],
      backend: [],
      platform: ['WordPress'],
      tools: [],
    },
  },
  {
    id: 'cultur-always-wins',
    name: 'Cultur Always Wins',
    description: 'Shopify storefront for a London-based culture and fashion brand.',
    longDescription:
      'A premium fashion and culture storefront built on Shopify. Work covered custom Liquid sections, bespoke product experiences, collection pages, delivery estimation, restock flows and a fully custom order confirmation, plus SEO and schema implementation.',
    year: 2025, // TODO: confirm year
    status: 'live',
    type: 'client',
    categories: ['web', 'ecommerce'],
    url: '', // TODO: add the live storefront URL
    repo: '',
    images: ['/projects/cultur-always-wins/cover.png'], // TODO: replace with a real capture
    stack: {
      frontend: ['Liquid', 'JavaScript', 'CSS'],
      backend: [],
      platform: ['Shopify'],
      tools: [],
    },
  },
  {
    id: 'wholesale-dellahs',
    name: "Wholesale Dellah's",
    description: "Wholesale storefront for the Dellah's Hair brand.",
    longDescription:
      "A wholesale storefront for the Dellah's Hair brand, aimed at trade buyers rather than retail customers. Work covered product presentation, buying quantities and a conversion-focused responsive layout.",
    year: 2024, // TODO: confirm year
    status: 'live',
    type: 'client',
    categories: ['web', 'ecommerce'],
    url: '', // TODO: add the live site URL
    repo: '',
    images: ['/projects/wholesale-dellahs/cover.png'], // TODO: replace with a real capture
    stack: {
      frontend: ['React'],
      backend: [],
      platform: [],
      tools: [],
    },
  },
  {
    id: 'blog-dellahs',
    name: "Dellah's Blog",
    description: "Editorial blog for the Dellah's Hair brand.",
    longDescription:
      "An editorial blog for the Dellah's Hair brand, built for content publishing around hair care, products and styling. Work covered template design, article layout and CMS-managed authoring.",
    year: 2024, // TODO: confirm year
    status: 'live',
    type: 'client',
    categories: ['web'],
    url: '', // TODO: add the live site URL
    repo: '',
    images: ['/projects/blog-dellahs/cover.png'], // TODO: replace with a real capture
    stack: {
      frontend: ['React'],
      backend: [],
      platform: ['Sanity'],
      tools: [],
    },
  },
  {
    id: 'dellahs-raw-hair',
    name: "Dellah's Raw Hair",
    description: "Product storefront for the Dellah's raw hair range.",
    longDescription:
      "A product storefront for the Dellah's raw hair range. Work focused on product presentation, image-led collection browsing and a responsive, conversion-focused purchase flow.",
    year: 2024, // TODO: confirm year
    status: 'live',
    type: 'client',
    categories: ['ecommerce'],
    url: '', // TODO: add the live site URL
    repo: '',
    images: ['/projects/dellahs-raw-hair/cover.png'], // TODO: replace with a real capture
    stack: {
      frontend: ['Liquid', 'JavaScript', 'CSS'], // TODO: confirm
      backend: [],
      platform: ['Shopify'], // TODO: confirm platform
      tools: [],
    },
  },
  {
    id: 'constant-flow',
    name: 'Constant Flow',
    description: 'Procurement platform connecting corporate buyers with suppliers.',
    longDescription:
      'A procurement technology platform built around corporate buyers, suppliers and competitive procurement workflows. Work includes procurement interfaces, vendor experiences, RFQ flows, product and fleet inventory, competitive bidding concepts and API-driven dashboards.',
    year: 2025, // TODO: confirm year
    status: 'in-progress',
    type: 'client',
    categories: ['web'],
    url: '', // TODO: add the live URL
    repo: '',
    images: ['/projects/constant-flow/cover.png'], // TODO: replace with a real capture
    stack: {
      frontend: ['React'], // TODO: add TypeScript / Vite if applicable
      backend: [], // TODO: add backend (e.g. Node.js, REST APIs)
      platform: [],
      tools: [],
    },
  },
  {
    id: 'my-neighbor',
    name: 'My Neighbor',
    description: 'Equipment rental platform for browsing and booking gear online.',
    // TODO: add what the build involved.
    longDescription:
      'An equipment rental platform that lets customers browse available equipment and book it online. Work covered the rental catalogue, availability and the booking flow, presented through a responsive storefront.',
    year: 2024, // TODO: confirm year
    status: 'live',
    type: 'client',
    categories: ['ecommerce'],
    url: '', // TODO: add the live store URL
    repo: '',
    images: ['/projects/my-neighbor/cover.png'], // TODO: replace with a real capture
    stack: {
      frontend: ['Next.js'],
      backend: [],
      platform: [],
      tools: [],
    },
  },
]

/** Projects belonging to a category, in the order they are declared above. */
export function projectsByCategory(categoryId: CategoryId): PortfolioProject[] {
  return portfolioProjects.filter(project => project.categories.includes(categoryId))
}

/** Categories that actually have work in them — empty ones are not rendered. */
export function populatedCategories(): WorkCategory[] {
  return workCategories.filter(category => projectsByCategory(category.id).length > 0)
}

/** Flattened, deduped stack entries used for the card chips. */
export function stackPreview(project: PortfolioProject, limit = 6): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const group of stackGroupOrder) {
    for (const item of project.stack[group]) {
      const key = item.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      result.push(item)
      if (result.length === limit) return result
    }
  }
  return result
}
