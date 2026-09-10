import { projects } from './projects'

export type StoryChapter = {
  id: string
  number: string
  title: string
  subtitle?: string
  /** Short narrative text */
  content: string[]
  /** Progress window [start, end] within 0–1 scroll journey */
  range: [number, number]
}

export const storyChapters: StoryChapter[] = [
  {
    id: 'intro',
    number: '00',
    title: 'INTRO',
    content: [],
    range: [0, 0.08],
  },
  {
    id: 'before-code',
    number: '01',
    title: 'BEFORE THE CODE',
    subtitle: 'WHERE IT BEGAN',
    content: [
      'Every builder starts somewhere.',
      'Before the frameworks, APIs, databases and deployments,',
      'there was curiosity.',
      'The desire to understand how things worked.',
      'And eventually, the desire to build them.',
      '[ADD YOUR PERSONAL STORY HERE]',
    ],
    range: [0.08, 0.18],
  },
  {
    id: 'curiosity',
    number: '02',
    title: 'THE CURIOSITY',
    subtitle: 'HOW IT STARTED',
    content: [
      'Curiosity became the driver.',
      'Each question led to exploration.',
      'Each exploration led to understanding.',
      'The journey from observer to creator.',
    ],
    range: [0.18, 0.28],
  },
  {
    id: 'learning',
    number: '03',
    title: 'LEARNING BY BUILDING',
    subtitle: 'THE PROCESS',
    content: [
      'The transition from learning technology to actually creating things.',
      'Understanding tools through application.',
      'Breaking things to understand how they work.',
      'Building ideas into working products.',
    ],
    range: [0.28, 0.38],
  },
  {
    id: 'projects',
    number: '04',
    title: 'FROM PROJECTS TO PRODUCTS',
    subtitle: 'THE WORK',
    content: [
      'Ideas become useful when they become real.',
      'Putting work in front of real people.',
      'Listening, measuring, refining, repeating.',
      'The evolution from experiments to products.',
    ],
    range: [0.38, 0.48],
  },
  {
    id: 'behind-screen',
    number: '05',
    title: 'BEHIND THE SCREEN',
    subtitle: 'THE TOOLS',
    content: [
      'The workspace where ideas become reality.',
      'Each tool serves a purpose.',
      'Each object has a story.',
      'Technology as the medium for creation.',
    ],
    range: [0.48, 0.58],
  },
  {
    id: 'thinking',
    number: '06',
    title: 'HOW I THINK',
    subtitle: 'THE MINDSET',
    content: [
      'The principles that guide the work.',
      'Understanding before solving.',
      'Simplifying complexity.',
      'Building ideas into reality.',
      'Iterating toward excellence.',
    ],
    range: [0.58, 0.68],
  },
  {
    id: 'capabilities',
    number: '07',
    title: 'WHAT I BUILD',
    subtitle: 'THE CAPABILITIES',
    content: [
      'The areas where expertise has developed.',
      'Digital experiences and applications.',
      'Systems and infrastructure.',
      'End-to-end digital products.',
    ],
    range: [0.68, 0.78],
  },
  {
    id: 'today',
    number: '08',
    title: 'TODAY',
    subtitle: 'THE CONTINUING JOURNEY',
    content: [
      'Still learning.',
      'Still building.',
      'Still solving.',
      'The story is still being written.',
    ],
    range: [0.78, 0.88],
  },
]

export const storyPrinciples = [
  {
    number: '01',
    title: 'UNDERSTAND',
    description: 'Understand the problem before solving it.',
  },
  {
    number: '02',
    title: 'SIMPLIFY',
    description: 'Good technology should make things clearer, not more complicated.',
  },
  {
    number: '03',
    title: 'BUILD',
    description: 'Ideas become useful when they become real.',
  },
  {
    number: '04',
    title: 'ITERATE',
    description: 'The first version is rarely the final version.',
  },
]

export const storyCapabilities = [
  {
    category: 'DIGITAL EXPERIENCES',
    description: 'Websites, interfaces, interactive experiences.',
  },
  {
    category: 'APPLICATIONS',
    description: 'Web apps and mobile applications.',
  },
  {
    category: 'SYSTEMS',
    description: 'APIs, databases, authentication, backend infrastructure.',
  },
  {
    category: 'PRODUCTS',
    description: 'End-to-end digital products.',
  },
]

export const storyTechnologies = [
  { name: 'React', description: 'Interactive interfaces, Web applications, Component architecture' },
  { name: 'React Native', description: 'Cross-platform mobile applications' },
  { name: 'JavaScript', description: 'Dynamic web experiences' },
  { name: 'TypeScript', description: 'Type-safe development' },
  { name: 'Node.js', description: 'Backend services and APIs' },
  { name: 'Python', description: 'Data processing and automation' },
  { name: 'MongoDB', description: 'NoSQL database architecture' },
  { name: 'MySQL', description: 'Relational database systems' },
  { name: 'Firebase', description: 'Real-time data and authentication' },
  { name: 'AWS', description: 'Cloud infrastructure and deployment' },
  { name: 'Shopify', description: 'E-commerce platforms' },
  { name: 'WordPress', description: 'Content management systems' },
  { name: 'Git', description: 'Version control and collaboration' },
]

export const storyFinal = {
  headline: 'TODAY',
  lines: ['STILL LEARNING.', 'STILL BUILDING.', 'STILL SOLVING.'],
  brand: 'KINGZCONNECT',
  role: 'Developer. Builder. Problem Solver.',
  closing: 'THE STORY IS STILL BEING WRITTEN.',
  cta1: 'EXPLORE PROJECTS',
  cta2: 'BACK TO HOME',
}

/** Navigable chapter markers (exclude intro void) */
export const storyNavChapters = storyChapters.filter((c) => c.id !== 'intro')

export const storyProjects = projects

export const mobileTechLabels = [
  'React Native',
  'Expo',
  'APIs',
  'Firebase',
] as const

export const toolboxItems = [
  'React',
  'Node.js',
  'Python',
  'React Native',
  'JavaScript',
  'Shopify',
  'WordPress',
  'Firebase',
  'MongoDB',
  'MySQL',
  'AWS',
  'Git',
] as const

export function getChapterAtProgress(progress: number): StoryChapter {
  const clamped = Math.min(1, Math.max(0, progress))
  for (let i = storyChapters.length - 1; i >= 0; i--) {
    const chapter = storyChapters[i]
    if (clamped >= chapter.range[0]) return chapter
  }
  return storyChapters[0]
}

export function getChapterLocalProgress(progress: number, chapter: StoryChapter) {
  const [start, end] = chapter.range
  const span = Math.max(0.0001, end - start)
  return Math.min(1, Math.max(0, (progress - start) / span))
}
