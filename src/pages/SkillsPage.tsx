import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MobileMenu } from '../components/nav/MobileMenu'
import { useSEO } from '../hooks/useSEO'

interface Technology {
  name: string
  category: string
  projects: string[]
  description?: string
  size?: 'large' | 'medium' | 'small'
}

interface SkillSection {
  id: number
  title: string
  subtitle?: string
  description: string
  technologies: Technology[]
  capabilities: string[]
  projects: string[]
  projectDetails?: Record<string, string[]>
  hasDiagram?: boolean
  diagramType?: 'data-flow' | 'system-architecture'
}

/**
 * Every tool below lives in exactly one section — its primary domain — so no
 * stack is ever listed twice across the page. The old "THE STACK" summary was
 * the union of this list, so it has been removed rather than repeated.
 */
const skillSections: SkillSection[] = [
  {
    id: 1,
    title: "FRONTEND",
    description: "Interfaces are where ideas become tangible.",
    technologies: [
      { name: "REACT", category: "Frontend", projects: ["KINGZCONNECT", "CONSTANTFLOW PROCUREMENT", "TASK2K", "APEX", "AXON"], size: "large" },
      { name: "NEXT.JS", category: "Frontend", projects: ["KINGZCONNECT", "TASK2K", "CONSTANTFLOW PROCUREMENT"], size: "medium" },
      { name: "JAVASCRIPT", category: "Frontend", projects: ["KINGZCONNECT", "CULTUR ALWAYS WINS", "DELLAH'S HAIR", "APEX", "AXON"], size: "medium" },
      { name: "TYPESCRIPT", category: "Frontend", projects: ["KINGZCONNECT", "CONSTANTFLOW PROCUREMENT", "TASK2K", "AXON"], size: "medium" },
      { name: "HTML", category: "Frontend", projects: ["KINGZCONNECT", "CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "small" },
      { name: "CSS", category: "Frontend", projects: ["KINGZCONNECT", "CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "small" }
    ],
    capabilities: ["RESPONSIVE DESIGN", "COMPONENT ARCHITECTURE", "API INTEGRATION", "INTERACTIVE UI", "ACCESSIBLE INTERFACES", "PERFORMANCE"],
    projects: ["KINGZCONNECT", "CONSTANTFLOW PROCUREMENT", "TASK2K", "APEX", "AXON"],
    projectDetails: {
      "APEX": ["React Native", "API integration", "data-driven interfaces"],
      "AXON": ["React Native", "API integration", "authentication"],
      "CONSTANTFLOW PROCUREMENT": ["React", "Next.js", "TypeScript"],
      "TASK2K": ["React", "Next.js", "TypeScript"],
      "KINGZCONNECT": ["React", "Next.js", "TypeScript"]
    }
  },
  {
    id: 2,
    title: "BACKEND",
    subtitle: "+ DATA",
    description: "The interface is only one part of the system.",
    technologies: [
      { name: "NODE.JS", category: "Backend", projects: ["CONSTANTFLOW PROCUREMENT", "TASK2K", "AXON"], size: "large" },
      { name: "PYTHON", category: "Backend", projects: ["APEX"], size: "medium" },
      { name: "FIREBASE", category: "Backend", projects: ["AXON", "TASK2K"], size: "medium" },
      { name: "MONGODB", category: "Backend", projects: ["TASK2K"], size: "small" },
      { name: "MYSQL", category: "Backend", projects: ["CONSTANTFLOW PROCUREMENT"], size: "small" },
      { name: "REST APIs", category: "Backend", projects: ["CONSTANTFLOW PROCUREMENT", "TASK2K", "APEX", "AXON"], size: "small" }
    ],
    capabilities: ["DATABASE DESIGN", "API INTEGRATION", "AUTHENTICATION", "DATA PROCESSING", "SERVER-SIDE LOGIC"],
    projects: ["CONSTANTFLOW PROCUREMENT", "TASK2K", "APEX", "AXON"],
    hasDiagram: true,
    diagramType: "data-flow"
  },
  {
    id: 3,
    title: "MOBILE",
    description: "Extending products beyond the browser.",
    technologies: [
      { name: "REACT NATIVE", category: "Mobile", projects: ["APEX", "AXON"], size: "large" },
      { name: "EXPO", category: "Mobile", projects: ["APEX", "AXON"], size: "medium" },
      { name: "FCM", category: "Mobile", projects: ["AXON"], size: "small" },
      { name: "NOTIFEE", category: "Mobile", projects: ["AXON"], size: "small" },
      { name: "ANDROID", category: "Mobile", projects: ["AXON"], size: "small" }
    ],
    capabilities: ["MOBILE UI", "API INTEGRATION", "AUTHENTICATION", "PUSH NOTIFICATIONS", "APP STATE", "ANDROID DEPLOYMENT"],
    projects: ["APEX", "AXON"]
  },
  {
    id: 4,
    title: "COMMERCE",
    description: "The storefront is part of the product.",
    technologies: [
      { name: "SHOPIFY", category: "Commerce", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "large" },
      { name: "LIQUID", category: "Commerce", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "large" }
    ],
    capabilities: ["CUSTOM STOREFRONTS", "LIQUID DEVELOPMENT", "PRODUCT EXPERIENCES", "COLLECTION SYSTEMS", "CUSTOM SECTIONS", "RESPONSIVE COMMERCE", "SEO", "CONVERSION UX"],
    projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"],
    projectDetails: {
      "CULTUR ALWAYS WINS": ["SHOPIFY", "LIQUID", "CUSTOM THEME DEVELOPMENT", "PRODUCT EXPERIENCE"],
      "DELLAH'S HAIR": ["SHOPIFY", "LIQUID", "CUSTOM THEME DEVELOPMENT", "PRODUCT EXPERIENCE"]
    }
  },
  {
    id: 5,
    title: "CMS",
    subtitle: "+ SEO",
    description: "Content structure and discoverability.",
    technologies: [
      { name: "WORDPRESS", category: "CMS", projects: ["WORDPRESS PROJECTS"], size: "large" },
      { name: "ELEMENTOR", category: "CMS", projects: ["WORDPRESS PROJECTS"], size: "medium" },
      { name: "ASTRA", category: "CMS", projects: ["WORDPRESS PROJECTS"], size: "medium" }
    ],
    capabilities: ["CONTENT STRUCTURE", "TECHNICAL SEO", "ON-PAGE SEO", "SCHEMA", "CMS CUSTOMIZATION", "RESPONSIVE DEVELOPMENT"],
    projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR", "WORDPRESS PROJECTS"]
  },
  {
    id: 6,
    title: "SYSTEMS",
    description: "Products are systems of interfaces, data, logic and people.",
    technologies: [
      { name: "REDIS", category: "Systems", projects: ["APEX"], size: "medium" },
      { name: "AWS", category: "Systems", projects: ["TASK2K"], size: "medium" },
      { name: "CELERY", category: "Systems", projects: ["APEX"], size: "small" },
      { name: "GIT", category: "Systems", projects: ["ALL PROJECTS"], size: "small" }
    ],
    capabilities: ["SYSTEM ARCHITECTURE", "API DESIGN", "DATABASE DESIGN", "AUTHENTICATION", "DATA PROCESSING"],
    projects: ["CONSTANTFLOW PROCUREMENT", "TASK2K", "APEX", "AXON"],
    hasDiagram: true,
    diagramType: "system-architecture"
  },
  {
    id: 7,
    title: "INTELLIGENT",
    subtitle: "APPLICATIONS",
    description: "Building applications that use data, automation and AI-assisted workflows.",
    technologies: [
      { name: "DATA PROCESSING", category: "Intelligent", projects: ["APEX"], description: "Sports data aggregation", size: "large" },
      { name: "PREDICTION SYSTEMS", category: "Intelligent", projects: ["APEX"], description: "Match outcome prediction", size: "medium" },
      { name: "AUTOMATION", category: "Intelligent", projects: ["APEX", "TASK2K"], description: "Backend workers and workflows", size: "medium" },
      { name: "AI-ASSISTED WORKFLOWS", category: "Intelligent", projects: ["TASK2K"], description: "Research participation assistance", size: "medium" }
    ],
    capabilities: ["DATA PROCESSING", "API AGGREGATION", "STATISTICAL MODELLING", "AUTOMATED WORKFLOWS"],
    projects: ["APEX", "TASK2K"],
    projectDetails: {
      "APEX": ["Sports data", "Prediction systems", "API aggregation", "Data processing"],
      "TASK2K": ["AI-assisted workflows", "Automation"]
    }
  }
]

/**
 * One typographic treatment for every numbered element on the page: Inter,
 * a single weight, one fluid size scale and tabular figures, so numbers read
 * identically on a 320px phone and a 1440px display without breakpoint jumps.
 */
const NUMBER_DISPLAY = 'font-inter tabular-nums font-medium leading-none'
const numberDisplayClass = `${NUMBER_DISPLAY} text-[clamp(2.5rem,8vw,8rem)] tracking-[0.02em]`
const numberLabelClass = `${NUMBER_DISPLAY} text-[10px] tracking-[0.34em] md:text-xs`

export function SkillsPage() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null)
  const [hoveredProject, setHoveredProject] = useState<string>('')
  const [reducedMotion, setReducedMotion] = useState(false)

  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  const currentYear = new Date().getFullYear()

  useSEO('skills')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      // Show all sections immediately if reduced motion is enabled
      setVisibleSections(new Set(skillSections.map(s => s.id)))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = parseInt((entry.target as HTMLElement).dataset.id || '0')
            setVisibleSections(prev => new Set([...prev, sectionId]))
          }
        })
      },
      // threshold 0 so sections taller than the viewport (the mobile layout)
      // still reveal instead of waiting for a ratio they can never reach.
      { threshold: 0, rootMargin: '0px 0px -15% 0px' }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [reducedMotion])

  const handleTechHover = (tech: Technology) => {
    setHoveredTech(tech)
  }

  const handleTechLeave = () => {
    setHoveredTech(null)
  }

  const handleTechClick = (tech: Technology) => {
    // For mobile/touch devices
    setHoveredTech(hoveredTech && hoveredTech.name === tech.name ? null : tech)
  }

  const handleProjectHover = (projectName: string) => {
    setHoveredProject(projectName)
  }

  const handleProjectLeave = () => {
    setHoveredProject('')
  }

  // Base sizes are the mobile list; md/lg keep the original editorial scale.
  const getTechSize = (tech: Technology) => {
    switch (tech.size) {
      case 'large':
        return 'text-2xl md:text-5xl lg:text-6xl'
      case 'medium':
        return 'text-lg md:text-3xl lg:text-4xl'
      case 'small':
      default:
        return 'text-base md:text-xl lg:text-2xl'
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#0c0c0c] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between gap-4 px-4 sm:px-6 pt-4 sm:pt-6 md:px-10 md:pt-8 pointer-events-none">
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          <Link
            to="/"
            className="font-hn text-[10px] sm:text-sm tracking-[0.26em] text-white hover:text-white/80 transition-opacity duration-300 hover:opacity-75 font-semibold flex min-h-[48px] -my-2 items-center gap-2 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Return to Home"
          >
            ← BACK
          </Link>
          <div className={`${numberLabelClass} text-white/60`}>
            SKILLS / 01
          </div>
        </div>
        <div className="hidden md:flex items-start gap-12 sm:gap-16 lg:gap-24 pointer-events-auto">
          <div className="font-inter tabular-nums text-xs sm:text-sm text-white/60">{currentYear}</div>
          <nav aria-label="Primary" className="flex flex-col gap-0.5 text-xs sm:text-sm">
            <Link to="/story" className="text-left text-white/60 hover:text-white duration-300">Story</Link>
            <Link to="/jobs" className="text-left text-white/60 hover:text-white duration-300">Jobs</Link>
            <Link to="/projects" className="text-left text-white/60 hover:text-white duration-300">Projects</Link>
            <span className="text-left text-white relative">
              Skills
              <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            </span>
            <Link to="/message" className="text-left text-white/60 hover:text-white duration-300">Message</Link>
          </nav>
        </div>
        <MobileMenu activeLabel="Skills" tone="white" showSocial className="pointer-events-auto" />
      </header>

      {/* Opening Section */}
      <section className="flex min-h-[100svh] flex-col justify-center items-center px-4 pt-24 sm:px-6 md:px-10">
        <div className="text-center max-w-4xl w-full">
          <div className={`${numberLabelClass} mb-8 text-white/60 sm:mb-12`}>
            SKILLS / 01
          </div>
          <h1 className="font-weghorst text-[clamp(2.5rem,8vw,10rem)] leading-[0.85] text-white mb-8 sm:mb-12">
            THE<br />TOOLKIT<br />BEHIND<br />THE WORK.
          </h1>
          <p className="font-hn text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed mb-12 sm:mb-16">
            I build digital products across<br />
            web, mobile, commerce and<br />
            application systems.
          </p>
          <div className="font-hn text-xs tracking-[0.22em] text-white/40">
            EXPLORE THE STACK ↓
          </div>
        </div>
      </section>

      {/* Skill Sections */}
      {skillSections.map((section, index) => (
        <section
          key={section.id}
          ref={el => sectionRefs.current[index] = el as HTMLElement}
          data-id={section.id}
          className="flex flex-col justify-center border-t border-white/5 px-4 py-16 sm:px-6 sm:py-20 md:min-h-screen md:px-10"
        >
          <div className="max-w-7xl mx-auto w-full">
            {/* Section Header */}
            <div className="mb-10 sm:mb-16">
              <div className={`${numberDisplayClass} mb-4 text-white/20 sm:mb-6`}>
                {section.id.toString().padStart(2, '0')}
              </div>
              <h2 className="font-weghorst text-3xl sm:text-5xl md:text-7xl text-white mb-2 sm:mb-4">
                {section.title}
              </h2>
              {section.subtitle && (
                <div className="font-weghorst text-xl sm:text-3xl md:text-5xl text-white/60 mb-4">
                  {section.subtitle}
                </div>
              )}
              <p className="font-hn text-sm sm:text-base text-white/60 mt-4 sm:mt-6 max-w-lg leading-relaxed">
                {section.description}
              </p>
            </div>

            {/* Diagram for specific sections */}
            {section.hasDiagram && section.diagramType === 'data-flow' && (
              <div className="mb-10 sm:mb-16"
                   style={{ opacity: visibleSections.has(section.id) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
                <div className="flex flex-col items-center gap-2 font-hn text-xs sm:text-sm text-white/30">
                  <div>USER</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>INTERFACE</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>API</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>SERVER</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>DATABASE</div>
                </div>
              </div>
            )}

            {section.hasDiagram && section.diagramType === 'system-architecture' && (
              <div className="mb-10 sm:mb-16"
                   style={{ opacity: visibleSections.has(section.id) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
                <div className="flex flex-col items-center gap-2 font-hn text-xs sm:text-sm text-white/30">
                  <div>USER</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>UI</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>APPLICATION</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>API</div>
                  <div className="w-px h-8 sm:h-12 bg-cream/20"></div>
                  <div>DATABASE</div>
                </div>
              </div>
            )}

            {/* Mobile Phone Frame for Mobile Section */}
            {section.id === 3 && (
              <div className="mb-10 sm:mb-16 flex justify-center"
                   style={{ opacity: visibleSections.has(section.id) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
                <div className="w-32 h-64 sm:w-40 sm:h-80 border border-cream/20 rounded-lg bg-cream/5 relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-cream/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 border border-cream/20 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Technologies — rows on mobile, editorial field on md+ */}
            <div className="mb-10 sm:mb-16">
              <ul className="md:flex md:flex-wrap md:items-start md:gap-8 lg:gap-12">
                {section.technologies.map((tech, techIndex) => {
                  const isOpen = hoveredTech?.name === tech.name
                  const panelId = `tech-${section.id}-${techIndex}`
                  return (
                    <li
                      key={tech.name}
                      className={`border-b border-white/10 md:border-0 md:relative ${isOpen ? 'md:z-20' : ''}`}
                      onMouseEnter={() => handleTechHover(tech)}
                      onMouseLeave={handleTechLeave}
                    >
                      <button
                        type="button"
                        onClick={() => handleTechClick(tech)}
                        onFocus={() => handleTechHover(tech)}
                        onBlur={handleTechLeave}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        aria-label={`${tech.name} — ${tech.category}`}
                        className="group flex min-h-[56px] w-full items-center justify-between gap-4 py-3 text-left rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c] md:inline-flex md:w-auto md:min-h-0 md:py-0"
                        style={{
                          opacity: visibleSections.has(section.id) ? 1 : 0,
                          transform: visibleSections.has(section.id) ? 'translateY(0)' : 'translateY(20px)',
                          transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                          transitionDelay: `${techIndex * 80}ms`
                        }}
                      >
                        <span className={`font-hn block min-w-0 break-words text-white/70 transition-all duration-300 group-hover:text-white md:group-hover:scale-105 ${getTechSize(tech)}`}>
                          {tech.name}
                        </span>
                        <span className="font-inter font-medium shrink-0 text-[10px] tracking-[0.2em] text-white/30 sm:hidden">
                          {tech.category}
                        </span>
                      </button>

                      {/* Hover/Click Detail — inline on mobile, floating on desktop */}
                      {isOpen && (
                        <div
                          id={panelId}
                          className="mb-3 w-full rounded-sm border border-cream/20 bg-cream/10 p-4 backdrop-blur-sm md:absolute md:left-0 md:top-full md:z-10 md:mb-0 md:mt-2 md:w-64"
                        >
                          <div className="font-hn text-xs text-white/60 mb-2">{tech.category}</div>
                          {tech.description && (
                            <div className="font-hn text-[10px] text-white/40 mb-2">
                              {tech.description}
                            </div>
                          )}
                          <div className="font-hn text-[10px] text-white/40 mb-2">
                            Used across:
                          </div>
                          <div className="space-y-1">
                            {tech.projects.map((project, i) => (
                              <div key={i} className="font-hn text-[10px] text-white/50">
                                {project}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Capabilities */}
            {section.capabilities.length > 0 && (
              <div className="mb-10 sm:mb-16">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {section.capabilities.map((capability, capIndex) => (
                    <div
                      key={capability}
                      className="font-hn text-[10px] sm:text-xs text-white/30 tracking-[0.1em]"
                      style={{
                        opacity: visibleSections.has(section.id) ? 1 : 0,
                        transitionDelay: `${(section.technologies.length + capIndex) * 50}ms`
                      }}
                    >
                      {capability}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects with details */}
            {section.projects.length > 0 && (
              <div className="border-t border-cream/10 pt-8 sm:pt-12">
                <div className="font-hn text-[10px] sm:text-xs text-white/40 mb-4 sm:mb-6 tracking-[0.15em]">
                  USED ACROSS
                </div>
                <ul className="sm:flex sm:flex-wrap sm:gap-x-8">
                  {section.projects.map((project, projIndex) => {
                    const isOpen = hoveredProject === project
                    const details = section.projectDetails?.[project]
                    const panelId = `project-${section.id}-${projIndex}`
                    return (
                      <li
                        key={project}
                        className={`border-b border-white/10 sm:border-0 sm:relative ${isOpen ? 'sm:z-20' : ''}`}
                        onMouseEnter={() => handleProjectHover(project)}
                        onMouseLeave={handleProjectLeave}
                      >
                        <button
                          type="button"
                          onClick={() => handleProjectHover(isOpen ? '' : project)}
                          onFocus={() => handleProjectHover(project)}
                          onBlur={handleProjectLeave}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          className="flex min-h-[48px] w-full items-center py-2 text-left rounded-sm sm:min-h-0 sm:w-auto sm:py-0 font-hn text-sm text-white/60 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c]"
                          style={{
                            opacity: visibleSections.has(section.id) ? 1 : 0,
                            transitionDelay: `${(section.technologies.length + section.capabilities.length + projIndex) * 50}ms`
                          }}
                        >
                          {project}
                        </button>

                        {/* Project Details — inline on mobile, floating on desktop */}
                        {isOpen && details && (
                          <div
                            id={panelId}
                            className="mb-3 w-full rounded-sm border border-cream/20 bg-cream/10 p-4 backdrop-blur-sm sm:absolute sm:left-0 sm:top-full sm:z-10 sm:mb-0 sm:mt-2 sm:w-64"
                          >
                            <div className="space-y-1">
                              {details.map((detail, i) => (
                                <div key={i} className="font-hn text-[10px] text-white/50">
                                  {detail}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* Final CTA Section */}
      <section className="flex min-h-[100svh] flex-col justify-center items-center border-t border-cream/5 px-4 sm:px-6 md:px-10">
        <div className="text-center max-w-4xl w-full">
          <h2 className="font-weghorst text-3xl sm:text-4xl md:text-6xl text-white mb-8 sm:mb-12">
            THE TOOLS<br />ARE ONLY<br />THE START.
          </h2>
          <p className="font-hn text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed mb-12 sm:mb-16">
            WHAT MATTERS<br />IS WHAT YOU<br />BUILD WITH THEM.
          </p>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-8">
            <Link
              to="/jobs"
              className="font-hn inline-flex min-h-[48px] items-center justify-center rounded-sm border border-white/15 px-6 text-xs tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white/5 hover:text-white/80 sm:border-0 sm:px-0"
            >
              JOBS →
            </Link>
            <Link
              to="/message"
              className="font-hn inline-flex min-h-[48px] items-center justify-center rounded-sm border border-white/15 px-6 text-xs tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white/5 hover:text-white/80 sm:border-0 sm:px-0"
            >
              MESSAGE →
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Metadata */}
      <div className="z-40 flex flex-col gap-6 px-6 pb-6 pt-10 text-xs sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pb-8 sm:text-sm lg:pointer-events-none lg:fixed lg:inset-x-0 lg:bottom-0 lg:pt-0">
        <div className="font-hn text-white/40">
          <div>SKILLS</div>
          <div className="mt-1">FRONTEND</div>
          <div>BACKEND</div>
          <div>MOBILE</div>
          <div>COMMERCE</div>
          <div>SYSTEMS</div>
        </div>
        <div className="font-hn text-white/40 text-right">
          <div>BASED IN</div>
          <div className="mt-1">NIGERIA</div>
          <div>WORKING WORLDWIDE</div>
        </div>
      </div>
    </div>
  )
}
