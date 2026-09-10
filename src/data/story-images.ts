export type StoryChapter = {
  id: string
  number: string
  title: string
  subtitle?: string
  /** Path to the chapter image */
  image: string
  /** Image alt text for accessibility */
  imageAlt: string
  /** Narrative text for the chapter */
  content: string[]
  /** Layout variant: 'full-bleed', 'split', 'text-overlay', 'image-focus' */
  layout?: 'full-bleed' | 'split' | 'text-overlay' | 'image-focus'
}

export const storyChapters: StoryChapter[] = [
  {
    id: 'intro',
    number: '00',
    title: 'INTRO',
    image: '/images/story/00-intro.png',
    imageAlt: 'KingzConnect portrait - the developer',
    content: [],
    layout: 'text-overlay',
  },
  {
    id: 'before-code',
    number: '01',
    title: 'BEFORE THE CODE',
    subtitle: 'WHERE IT BEGAN',
    image: '/images/story/01-before-code.png',
    imageAlt: 'Early workspace with laptop and learning materials',
    content: [
      'Every product starts somewhere.',
      'Before polished interfaces, complex systems and production deployments, there was curiosity.',
      'The desire to understand how things worked became the starting point.',
    ],
    layout: 'split',
  },
  {
    id: 'curiosity',
    number: '02',
    title: 'THE CURIOSITY',
    subtitle: 'HOW IT STARTED',
    image: '/images/story/02-curiosity.png',
    imageAlt: 'Hands working on laptop with notebook and sketches',
    content: [
      'Curiosity became experimentation.',
      'Questions became projects.',
      'Projects became a way of learning.',
    ],
    layout: 'image-focus',
  },
  {
    id: 'learning',
    number: '03',
    title: 'LEARNING BY BUILDING',
    subtitle: 'THE PROCESS',
    image: '/images/story/03-learning.png',
    imageAlt: 'Developer workspace with multiple monitors and code',
    content: [
      'The fastest way to learn was to build.',
      'Not just tutorials.',
      'Not just theory.',
      'Real things. Broken things. Things that had to work.',
    ],
    layout: 'split',
  },
  {
    id: 'products',
    number: '04',
    title: 'FROM PROJECTS TO PRODUCTS',
    subtitle: 'THE WORK',
    image: '/images/story/04-products.png',
    imageAlt: 'Sophisticated workspace showing professional development environment',
    content: [
      'Projects became products.',
      'Experiments became systems.',
      'Ideas became things people could actually use.',
    ],
    layout: 'image-focus',
  },
  {
    id: 'behind-screen',
    number: '05',
    title: 'BEHIND THE SCREEN',
    subtitle: 'THE TOOLS',
    image: '/images/story/05-behind-screen.png',
    imageAlt: 'Over-the-shoulder shot of developer at workstation with city view',
    content: [
      'What people see is the interface.',
      'Behind it are decisions.',
      'Architecture.',
      'Logic.',
      'Iteration.',
      'And a lot of problem solving.',
    ],
    layout: 'full-bleed',
  },
  {
    id: 'thinking',
    number: '06',
    title: 'HOW I THINK',
    subtitle: 'THE MINDSET',
    image: '/images/story/06-how-i-think.png',
    imageAlt: 'Editorial desk composition with wireframes and architecture diagrams',
    content: [
      'I don\'t start with code.',
      'I start with the problem.',
      'Understand it.',
      'Break it down.',
      'Find the simplest system that can solve it.',
    ],
    layout: 'split',
  },
  {
    id: 'capabilities',
    number: '07',
    title: 'WHAT I BUILD',
    subtitle: 'THE CAPABILITIES',
    image: '/images/story/07-what-i-build.png',
    imageAlt: 'Technology ecosystem showing web, mobile, commerce, APIs, databases, and cloud',
    content: [
      'Websites.',
      'Applications.',
      'Commerce.',
      'APIs.',
      'Data.',
      'Systems.',
      'Different tools.',
      'One goal — build something useful.',
    ],
    layout: 'image-focus',
  },
  {
    id: 'today',
    number: '08',
    title: 'TODAY',
    subtitle: 'THE CONTINUING JOURNEY',
    image: '/images/story/08-today.png',
    imageAlt: 'Developer at premium workstation with city view through windows',
    content: [
      'Still learning.',
      'Still building.',
      'Still solving.',
    ],
    layout: 'full-bleed',
  },
]

export const storyFinal = {
  headline: 'THE STORY',
  subheadline: 'IS STILL',
  finalLine: 'BEING WRITTEN.',
  cta1: 'EXPLORE THE WORK',
  cta2: 'BACK TO HOME',
}

export function getChapterById(id: string): StoryChapter | undefined {
  return storyChapters.find((chapter) => chapter.id === id)
}
