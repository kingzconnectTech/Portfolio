// Cinematic scene data for the full-screen documentary story experience.
// Each scene controls its own image composition, text position, and overlay.

export interface CinematicScene {
  id: number
  number: string
  /** Multi-line title — each string is a separate visual line */
  title: string[]
  /** Narrative body — each string is a paragraph line */
  body: string[]
  image: string
  imageAlt: string
  /** CSS object-position for desktop */
  imagePosition: string
  /** CSS object-position for mobile viewports */
  mobileImagePosition?: string
  /** Which side of the screen text lives on */
  textPosition: 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'center'
  /** Directional gradient to aid text readability */
  gradient: 'left' | 'right' | 'bottom' | 'top' | 'none'
  /** 0–1 — gradient opacity */
  overlayStrength: number
  /** Scene 09: show CTA buttons */
  isOutro?: boolean
}

export const cinematicScenes: CinematicScene[] = [
  {
    id: 0,
    number: '00',
    title: ["THIS ISN'T JUST", 'A PORTFOLIO.'],
    body: ["IT'S THE STORY", 'BEHIND THE WORK.', '', 'KINGZCONNECT'],
    image: '/images/story/00-intro.png',
    imageAlt: 'KingzConnect — developer portrait',
    imagePosition: 'center right',
    mobileImagePosition: 'center 30%',
    textPosition: 'bottom-left',
    gradient: 'bottom',
    overlayStrength: 0.72,
  },
  {
    id: 1,
    number: '01',
    title: ['BEFORE', 'THE CODE'],
    body: [
      'Every product starts somewhere.',
      '',
      'Before polished interfaces,',
      'complex systems and production',
      'deployments, there was curiosity.',
    ],
    image: '/images/story/01-before-code.png',
    imageAlt: 'Early workspace — laptop, notebook, natural light',
    imagePosition: 'center left',
    mobileImagePosition: 'center',
    textPosition: 'right',
    gradient: 'right',
    overlayStrength: 0.58,
  },
  {
    id: 2,
    number: '02',
    title: ['THE', 'CURIOSITY'],
    body: [
      'Questions became experiments.',
      '',
      'Experiments became projects.',
      '',
      'Projects became a way to learn.',
    ],
    image: '/images/story/02-curiosity.png',
    imageAlt: 'Hands working on laptop — close workspace, notebook, sketches',
    imagePosition: 'center right',
    mobileImagePosition: 'center',
    textPosition: 'left',
    gradient: 'left',
    overlayStrength: 0.52,
  },
  {
    id: 3,
    number: '03',
    title: ['LEARNING', 'BY BUILDING'],
    body: [
      'The fastest way to learn',
      'was to build.',
      '',
      'Real things.',
      'Broken things.',
      'Things that had to work.',
    ],
    image: '/images/story/03-learning.png',
    imageAlt: 'Developer actively building with multiple monitors and code',
    imagePosition: 'center',
    mobileImagePosition: 'center',
    textPosition: 'left',
    gradient: 'left',
    overlayStrength: 0.60,
  },
  {
    id: 4,
    number: '04',
    title: ['FROM PROJECTS', 'TO PRODUCTS'],
    body: [
      'Projects became products.',
      '',
      'Experiments became systems.',
      '',
      'Ideas became things',
      'people could actually use.',
    ],
    image: '/images/story/04-products.png',
    imageAlt: 'Sophisticated professional workstation with polished UI',
    imagePosition: 'center left',
    mobileImagePosition: 'center',
    textPosition: 'right',
    gradient: 'right',
    overlayStrength: 0.55,
  },
  {
    id: 5,
    number: '05',
    title: ['BEHIND', 'THE SCREEN'],
    body: [
      'What people see is the interface.',
      '',
      'Behind it are decisions.',
      '',
      'Architecture.',
      'Logic.',
      'Iteration.',
      'Problem solving.',
    ],
    image: '/images/story/05-behind-screen.png',
    imageAlt: 'Cinematic over-the-shoulder view of developer at workstation',
    imagePosition: 'center right',
    mobileImagePosition: 'center 40%',
    textPosition: 'left',
    gradient: 'left',
    overlayStrength: 0.52,
  },
  {
    id: 6,
    number: '06',
    title: ['HOW', 'I THINK'],
    body: [
      "I don't start with code.",
      '',
      'I start with the problem.',
      '',
      'Understand it.',
      'Break it down.',
      'Build the solution.',
    ],
    image: '/images/story/06-how-i-think.png',
    imageAlt: 'Editorial desk still-life with architecture diagrams and notebook',
    imagePosition: 'center right',
    mobileImagePosition: 'center',
    textPosition: 'left',
    gradient: 'left',
    overlayStrength: 0.55,
  },
  {
    id: 7,
    number: '07',
    title: ['WHAT', 'I BUILD'],
    body: [
      'Websites.',
      'Applications.',
      'Commerce.',
      'APIs.',
      'Data.',
      'Systems.',
      '',
      'Different tools.',
      'One goal —',
      'build something useful.',
    ],
    image: '/images/story/07-what-i-build.png',
    imageAlt: 'Technology composition with devices and integrated systems',
    imagePosition: 'center left',
    mobileImagePosition: 'center',
    textPosition: 'right',
    gradient: 'right',
    overlayStrength: 0.55,
  },
  {
    id: 8,
    number: '08',
    title: ['TODAY'],
    body: [
      'Still learning.',
      '',
      'Still building.',
      '',
      'Still solving.',
      '',
      'KINGZCONNECT',
    ],
    image: '/images/story/08-today.png',
    imageAlt: 'Developer at calm workstation with city view outside',
    imagePosition: 'center right',
    mobileImagePosition: 'center 30%',
    textPosition: 'bottom-left',
    gradient: 'bottom',
    overlayStrength: 0.65,
  },
  {
    id: 9,
    number: '09',
    title: ['THE STORY', 'IS STILL', 'BEING WRITTEN.'],
    body: [],
    image: '/images/story/09-outro.png',
    imageAlt: 'Empty premium workspace with chair suggesting continuing work',
    imagePosition: 'center',
    mobileImagePosition: 'center',
    textPosition: 'center',
    gradient: 'bottom',
    overlayStrength: 0.50,
    isOutro: true,
  },
]

export const TOTAL_SCENES = cinematicScenes.length
