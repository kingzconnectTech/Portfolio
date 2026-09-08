import { projects } from './projects'

export type StoryChapter = {
  id: string
  number: string
  title: string
  /** Short lines shown beside the scene — keep editorial and sparse */
  lines: string[]
  visual: string
  /** Progress window [start, end] within 0–1 scroll journey */
  range: [number, number]
}

export const storyMeta = {
  title: 'THE MAKING\nOF A BUILDER',
  subtitle: 'A story told through things built.',
  scrollHint: 'SCROLL TO EXPLORE',
  supporting: [
    'Ideas became experiments.',
    'Experiments became products.',
    'Products became a craft.',
  ],
  final: {
    lines: ['Still learning.', 'Still building.', 'Still solving.'],
    brand: 'KINGZCONNECT',
    statement: ['Built with curiosity.', 'Driven by problems.', 'Defined by what gets built.'],
    cta: 'BACK TO HOME',
  },
}

export const storyChapters: StoryChapter[] = [
  {
    id: 'intro',
    number: '00',
    title: 'INTRO',
    lines: [],
    visual: 'void',
    range: [0, 0.06],
  },
  {
    id: 'curiosity',
    number: '01',
    title: 'CURIOSITY',
    lines: [
      'It started with a simple question:',
      '“How does this work?”',
      'Curiosity became experimentation.',
    ],
    visual: 'laptop',
    range: [0.06, 0.15],
  },
  {
    id: 'learning',
    number: '02',
    title: 'LEARNING',
    lines: ['Every project became another lesson.'],
    visual: 'code',
    range: [0.15, 0.24],
  },
  {
    id: 'experimentation',
    number: '03',
    title: 'EXPERIMENTATION',
    lines: ['Build it.', 'Break it.', 'Understand why.', 'Build it better.'],
    visual: 'workspace',
    range: [0.24, 0.33],
  },
  {
    id: 'web',
    number: '04',
    title: 'THE WEB',
    lines: [
      'Interfaces became more than screens.',
      'They became experiences.',
    ],
    visual: 'browser',
    range: [0.33, 0.42],
  },
  {
    id: 'mobile',
    number: '05',
    title: 'MOBILE',
    lines: ['The same ideas.', 'A different canvas.'],
    visual: 'phone',
    range: [0.42, 0.51],
  },
  {
    id: 'systems',
    number: '06',
    title: 'SYSTEMS',
    lines: [
      'Building the interface is only part of the problem.',
      'The system behind it has to work.',
    ],
    visual: 'systems',
    range: [0.51, 0.6],
  },
  {
    id: 'problem-solving',
    number: '07',
    title: 'PROBLEM SOLVING',
    lines: ['Bugs.', 'Broken APIs.', 'Unexpected behaviour.', 'solve it.'],
    visual: 'puzzle',
    range: [0.6, 0.69],
  },
  {
    id: 'building',
    number: '08',
    title: 'BUILDING REAL THINGS',
    lines: ['Work that left the studio.', 'And entered the world.'],
    visual: 'projects',
    range: [0.69, 0.78],
  },
  {
    id: 'toolbox',
    number: '09',
    title: 'THE TOOLBOX',
    lines: ['Tools chosen with intent.', 'Not collected for display.'],
    visual: 'toolbox',
    range: [0.78, 0.87],
  },
  {
    id: 'today',
    number: '10',
    title: 'TODAY',
    lines: storyMeta.final.lines,
    visual: 'today',
    range: [0.87, 1],
  },
]

/** Navigable chapter markers (exclude intro void) */
export const storyNavChapters = storyChapters.filter((c) => c.id !== 'intro')

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

export const mobileTechLabels = [
  'React Native',
  'Expo',
  'APIs',
  'Firebase',
] as const

export const systemNodes = [
  { id: 'user', label: 'USER' },
  { id: 'frontend', label: 'FRONTEND' },
  { id: 'api', label: 'API' },
  { id: 'server', label: 'SERVER' },
  { id: 'database', label: 'DATABASE' },
] as const

export const storyProjects = projects

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
