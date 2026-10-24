import { useLayoutEffect } from 'react'

/**
 * Site-wide SEO defaults plus the per-page copy.
 *
 * Pages are keyed rather than free-form so a typo fails type checking instead of
 * silently shipping an untitled page, and so all titles/descriptions can be
 * reviewed in one place.
 */
export const SITE_NAME = 'KingzConnect'

export interface SeoCopy {
  title: string
  description: string
}

export const PAGE_SEO = {
  home: {
    title: 'KingzConnect — Visuals Composer & Digital Crafter',
    description:
      'Independent product builder working across web, mobile, commerce and data-driven applications — from interface design through to backend systems.',
  },
  story: {
    title: 'Story — KingzConnect',
    description:
      'A cinematic look at the path from curiosity to code: the story behind the work, told scene by scene.',
  },
  jobs: {
    title: 'Work & Experience — KingzConnect',
    description:
      'Selected work across web development, e-commerce, digital products, mobile applications and data-driven systems, with the platforms and tools behind each project.',
  },
  skills: {
    title: 'Skills & Stack — KingzConnect',
    description:
      'The toolkit behind the work: frontend, backend and data, mobile, commerce, CMS, systems and intelligent applications.',
  },
  message: {
    title: 'Contact — KingzConnect',
    description:
      'Have an idea, a project or a role in mind? Start a conversation about what to build next.',
  },
} as const satisfies Record<string, SeoCopy>

export type SeoPage = keyof typeof PAGE_SEO

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }
  tag.setAttribute('href', href)
}

/**
 * Applies the title, description, canonical and Open Graph / Twitter tags for a page.
 *
 * These are written straight to `document.head` — no extra dependency — and run in a
 * layout effect so the tab title updates in the same frame as the route change.
 * The absolute URL comes from `window.location` because the production domain is not
 * known at build time.
 */
export function useSEO(page: SeoPage) {
  useLayoutEffect(() => {
    const { title, description } = PAGE_SEO[page]
    const url = window.location.origin + window.location.pathname

    document.title = title

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)

    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)

    upsertCanonical(url)
  }, [page])
}
