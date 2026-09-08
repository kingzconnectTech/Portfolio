export type Project = {
  id: string
  name: string
  category: string
  description: string
  technologies: string[]
  role: string
  link?: string
  /** Optional screenshot path under src/assets — replace when assets exist */
  screenshot?: string
}

/**
 * Editable project references for Story Chapter 08.
 * Replace placeholders with real work; screenshots plug in via `screenshot`.
 */
export const projects: Project[] = [
  {
    id: 'web-experience',
    name: 'Web Experience',
    category: 'PROJECT 01',
    description: 'Immersive interface work focused on narrative and interaction.',
    technologies: ['React', 'TypeScript', 'Three.js'],
    role: 'Design & Development',
  },
  {
    id: 'mobile-application',
    name: 'Mobile Application',
    category: 'PROJECT 02',
    description: 'Cross-platform product built for clarity on a small canvas.',
    technologies: ['React Native', 'Expo', 'Firebase'],
    role: 'Product Development',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    category: 'PROJECT 03',
    description: 'Commerce systems with custom storefront and checkout flows.',
    technologies: ['Shopify', 'JavaScript', 'CSS'],
    role: 'Full-Stack Implementation',
  },
  {
    id: 'system',
    name: 'System',
    category: 'PROJECT 04',
    description: 'Backend and data architecture that keeps the product reliable.',
    technologies: ['Node.js', 'MongoDB', 'AWS'],
    role: 'Systems Engineering',
  },
]
