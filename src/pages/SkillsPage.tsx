import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

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
      { name: "FIREBASE", category: "Mobile", projects: ["AXON"], size: "small" },
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
      { name: "LIQUID", category: "Commerce", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "large" },
      { name: "JAVASCRIPT", category: "Commerce", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "medium" },
      { name: "CSS", category: "Commerce", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "medium" }
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
      { name: "ASTRA", category: "CMS", projects: ["WORDPRESS PROJECTS"], size: "medium" },
      { name: "SHOPIFY", category: "CMS", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "small" },
      { name: "LIQUID", category: "CMS", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "small" }
    ],
    capabilities: ["CONTENT STRUCTURE", "TECHNICAL SEO", "ON-PAGE SEO", "SCHEMA", "CMS CUSTOMIZATION", "RESPONSIVE DEVELOPMENT"],
    projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR", "WORDPRESS PROJECTS"]
  },
  {
    id: 6,
    title: "SYSTEMS",
    description: "Products are systems of interfaces, data, logic and people.",
    technologies: [
      { name: "NODE.JS", category: "Systems", projects: ["CONSTANTFLOW PROCUREMENT", "TASK2K", "AXON"], size: "large" },
      { name: "FIREBASE", category: "Systems", projects: ["AXON", "TASK2K"], size: "medium" },
      { name: "REST APIs", category: "Systems", projects: ["CONSTANTFLOW PROCUREMENT", "TASK2K", "APEX", "AXON"], size: "medium" },
      { name: "MONGODB", category: "Systems", projects: ["TASK2K"], size: "small" },
      { name: "MYSQL", category: "Systems", projects: ["CONSTANTFLOW PROCUREMENT"], size: "small" },
      { name: "REDIS", category: "Systems", projects: ["APEX"], size: "small" },
      { name: "CELERY", category: "Systems", projects: ["APEX"], size: "small" },
      { name: "AWS", category: "Systems", projects: ["TASK2K"], size: "small" }
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
      { name: "PYTHON", category: "Intelligent", projects: ["APEX"], description: "Data processing and prediction systems", size: "large" },
      { name: "DATA PROCESSING", category: "Intelligent", projects: ["APEX"], description: "Sports data aggregation", size: "medium" },
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
  },
  {
    id: 8,
    title: "THE STACK",
    description: "The tools change. The approach stays the same.",
    technologies: [
      { name: "REACT", category: "Stack", projects: ["KINGZCONNECT", "CONSTANTFLOW PROCUREMENT", "TASK2K", "APEX", "AXON"], size: "large" },
      { name: "NEXT.JS", category: "Stack", projects: ["KINGZCONNECT", "TASK2K", "CONSTANTFLOW PROCUREMENT"], size: "large" },
      { name: "JAVASCRIPT", category: "Stack", projects: ["KINGZCONNECT", "CULTUR ALWAYS WINS", "DELLAH'S HAIR", "APEX", "AXON"], size: "large" },
      { name: "TYPESCRIPT", category: "Stack", projects: ["KINGZCONNECT", "CONSTANTFLOW PROCUREMENT", "TASK2K", "AXON"], size: "large" },
      { name: "HTML", category: "Stack", projects: ["KINGZCONNECT", "CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "medium" },
      { name: "CSS", category: "Stack", projects: ["KINGZCONNECT", "CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "medium" },
      { name: "NODE.JS", category: "Stack", projects: ["CONSTANTFLOW PROCUREMENT", "TASK2K", "AXON"], size: "medium" },
      { name: "PYTHON", category: "Stack", projects: ["APEX"], size: "medium" },
      { name: "REACT NATIVE", category: "Stack", projects: ["APEX", "AXON"], size: "medium" },
      { name: "SHOPIFY", category: "Stack", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "medium" },
      { name: "LIQUID", category: "Stack", projects: ["CULTUR ALWAYS WINS", "DELLAH'S HAIR"], size: "medium" },
      { name: "WORDPRESS", category: "Stack", projects: ["WORDPRESS PROJECTS"], size: "small" },
      { name: "ELEMENTOR", category: "Stack", projects: ["WORDPRESS PROJECTS"], size: "small" },
      { name: "FIREBASE", category: "Stack", projects: ["AXON", "TASK2K"], size: "small" },
      { name: "MONGODB", category: "Stack", projects: ["TASK2K"], size: "small" },
      { name: "MYSQL", category: "Stack", projects: ["CONSTANTFLOW PROCUREMENT"], size: "small" },
      { name: "REDIS", category: "Stack", projects: ["APEX"], size: "small" },
      { name: "CELERY", category: "Stack", projects: ["APEX"], size: "small" },
      { name: "AWS", category: "Stack", projects: ["TASK2K"], size: "small" },
      { name: "GIT", category: "Stack", projects: ["ALL PROJECTS"], size: "small" }
    ],
    capabilities: [],
    projects: []
  }
]

export function SkillsPage() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set())
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null)
  const [hoveredProject, setHoveredProject] = useState<string>('')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileMenuOpen])
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  const currentYear = new Date().getFullYear()

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
      { threshold: 0.1 }
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

  const getTechSize = (tech: Technology) => {
    switch (tech.size) {
      case 'large':
        return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
      case 'medium':
        return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl'
      case 'small':
      default:
        return 'text-base sm:text-lg md:text-xl lg:text-2xl'
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-4 sm:px-6 pt-4 sm:pt-6 md:px-10 md:pt-8 pointer-events-none">
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-auto">
          <Link
            to="/"
            className="font-hn text-[10px] sm:text-xs tracking-[0.26em] text-white hover:text-white/80 transition-opacity duration-300 hover:opacity-75 sm:text-sm font-semibold flex items-center gap-2"
            aria-label="Return to Home"
          >
            ← BACK
          </Link>
          <div className="font-poppins font-hn text-[10px] tracking-[0.34em] text-white/60">
            SKILLS / 01
          </div>
        </div>
        <div className="hidden sm:flex items-start gap-12 sm:gap-16 lg:gap-24 pointer-events-auto">
          <div className="font-poppins font-hn text-xs sm:text-sm text-white/60">{currentYear}</div>
          <nav className="flex flex-col gap-0.5 text-xs sm:text-sm">
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
        {/* Mobile Menu */}
        <div className="sm:hidden pointer-events-auto">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/60 hover:text-white transition-colors p-2"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          {mobileMenuOpen && (
            <nav ref={mobileMenuRef} className="absolute top-full right-0 mt-2 bg-[#0c0c0c] border border-white/20 rounded-sm p-4 min-w-[200px]">
              <div className="font-poppins font-hn text-xs text-white/60 mb-4">{currentYear}</div>
              <div className="flex flex-col gap-2">
                <Link to="/story" className="text-left text-white/60 hover:text-white duration-300 py-1" onClick={() => setMobileMenuOpen(false)}>Story</Link>
                <Link to="/jobs" className="text-left text-white/60 hover:text-white duration-300 py-1" onClick={() => setMobileMenuOpen(false)}>Jobs</Link>
                <Link to="/projects" className="text-left text-white/60 hover:text-white duration-300 py-1" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
                <span className="text-left text-white py-1">Skills</span>
                <Link to="/message" className="text-left text-white/60 hover:text-white duration-300 py-1" onClick={() => setMobileMenuOpen(false)}>Message</Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Opening Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-10 pt-20">
        <div className="text-center max-w-4xl px-4">
          <div className="font-poppins font-hn text-[10px] tracking-[0.34em] text-white/60 mb-8 sm:mb-12">
            SKILLS / 01
          </div>
          <h1 className="font-weghorst text-[clamp(3rem,8vw,10rem)] leading-[0.85] text-white mb-8 sm:mb-12">
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
          className="min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-10 py-16 sm:py-20 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto w-full px-2">
            {/* Section Header */}
            <div className="mb-12 sm:mb-16">
              <div className="font-poppins font-weghorst text-5xl sm:text-7xl md:text-9xl text-white/20 mb-4 sm:mb-6">
                {section.id.toString().padStart(2, '0')}
              </div>
              <h2 className="font-weghorst text-4xl sm:text-5xl md:text-7xl text-white mb-2 sm:mb-4">
                {section.title}
              </h2>
              {section.subtitle && (
                <div className="font-weghorst text-2xl sm:text-3xl md:text-5xl text-white/60 mb-4">
                  {section.subtitle}
                </div>
              )}
              <p className="font-hn text-sm sm:text-base text-white/60 mt-4 sm:mt-6 max-w-lg leading-relaxed">
                {section.description}
              </p>
            </div>

            {/* Diagram for specific sections */}
            {section.hasDiagram && section.diagramType === 'data-flow' && (
              <div className="mb-12 sm:mb-16"
                   style={{ opacity: visibleSections.has(section.id) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
                <div className="flex flex-col items-center gap-2 font-poppins font-hn text-xs sm:text-sm text-white/30">
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
              <div className="mb-12 sm:mb-16"
                   style={{ opacity: visibleSections.has(section.id) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
                <div className="flex flex-col items-center gap-2 font-poppins font-hn text-xs sm:text-sm text-white/30">
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
              <div className="mb-12 sm:mb-16 flex justify-center"
                   style={{ opacity: visibleSections.has(section.id) ? 1 : 0, transition: 'opacity 1s ease-out' }}>
                <div className="w-32 h-64 sm:w-40 sm:h-80 border border-cream/20 rounded-lg bg-cream/5 relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-cream/20 rounded-full"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 border border-cream/20 rounded-full"></div>
                </div>
              </div>
            )}

            {/* Technologies - Editorial Layout */}
            <div className="mb-12 sm:mb-16">
              <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                {section.technologies.map((tech, techIndex) => (
                  <div
                    key={tech.name}
                    className="relative cursor-pointer group focus:outline-none focus:ring-2 focus:ring-cream/30 focus:ring-offset-2 focus:ring-offset-[#0c0c0c] rounded-sm"
                    onMouseEnter={() => handleTechHover(tech)}
                    onMouseLeave={handleTechLeave}
                    onClick={() => handleTechClick(tech)}
                    onFocus={() => handleTechHover(tech)}
                    onBlur={handleTechLeave}
                    tabIndex={0}
                    role="button"
                    aria-label={`${tech.name} - ${tech.category}`}
                  >
                    <div
                      className={`font-hn transition-all duration-300 ${getTechSize(tech)} text-white/70 hover:text-white hover:scale-105`}
                      style={{
                        opacity: visibleSections.has(section.id) ? 1 : 0,
                        transform: visibleSections.has(section.id) ? 'translateY(0)' : 'translateY(20px)',
                        transitionDelay: `${techIndex * 100}ms`
                      }}
                    >
                      {tech.name}
                    </div>
                    
                    {/* Hover/Click Tooltip */}
                    {hoveredTech && hoveredTech.name === tech.name && (
                      <div className="absolute top-full left-0 mt-2 p-3 sm:p-4 bg-cream/10 backdrop-blur-sm border border-cream/20 rounded-sm z-10 w-full sm:w-64 opacity-100 transition-opacity duration-300">
                        <div className="font-hn text-xs text-white/60 mb-2">{tech.category}</div>
                        {tech.description && (
                          <div className="font-hn text-[10px] text-white/40 mb-2">
                            {tech.description}
                          </div>
                        )}
                        <div className="font-poppins font-hn text-[10px] text-white/40 mb-2">
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
                  </div>
                ))}
              </div>
            </div>

            {/* Capabilities */}
            {section.capabilities.length > 0 && (
              <div className="mb-12 sm:mb-16">
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

            {/* Projects with Hover Details */}
            {section.projects.length > 0 && (
              <div className="border-t border-cream/10 pt-8 sm:pt-12">
                <div className="font-poppins font-hn text-[10px] sm:text-xs text-white/40 mb-4 sm:mb-6 tracking-[0.15em]">
                  USED ACROSS
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {section.projects.map((project, projIndex) => (
                    <div
                      key={project}
                      className="relative cursor-pointer group"
                      onMouseEnter={() => handleProjectHover(project)}
                      onMouseLeave={handleProjectLeave}
                      onClick={() => handleProjectHover(hoveredProject === project ? '' : project)}
                      style={{
                        opacity: visibleSections.has(section.id) ? 1 : 0,
                        transitionDelay: `${(section.technologies.length + section.capabilities.length + projIndex) * 50}ms`
                      }}
                    >
                      <div className="font-hn text-xs sm:text-sm text-white/60 hover:text-white transition-colors duration-300">
                        {project}
                      </div>
                      
                      {/* Project Details on Hover */}
                      {hoveredProject && hoveredProject === project && section.projectDetails?.[project] && (
                        <div className="absolute top-full left-0 mt-2 p-3 sm:p-4 bg-cream/10 backdrop-blur-sm border border-cream/20 rounded-sm z-10 w-full sm:w-64 opacity-100 transition-opacity duration-300">
                          <div className="space-y-1">
                            {section.projectDetails[project].map((detail, i) => (
                              <div key={i} className="font-hn text-[10px] text-white/50">
                                {detail}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {/* THE STACK Section - Editorial Technology Field */}
      <section
        ref={el => sectionRefs.current[7] = el as HTMLElement}
        data-id="8"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-10 py-16 sm:py-20 border-t border-cream/5"
      >
        <div className="max-w-7xl mx-auto w-full px-2">
          <div className="mb-12 sm:mb-16">
            <div className="font-poppins font-weghorst text-5xl sm:text-7xl md:text-9xl text-white/20 mb-4 sm:mb-6">
              08
            </div>
            <h2 className="font-weghorst text-4xl sm:text-5xl md:text-7xl text-white mb-4">
              THE STACK
            </h2>
            <p className="font-hn text-sm sm:text-base text-white/60 mt-4 sm:mt-6 max-w-lg leading-relaxed">
              The tools change. The approach stays the same.
            </p>
          </div>

          {/* Editorial Technology Field */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 py-8 sm:py-12">
            {skillSections[7].technologies.map((tech, techIndex) => (
              <div
                key={tech.name}
                className="relative cursor-pointer group focus:outline-none focus:ring-2 focus:ring-cream/30 focus:ring-offset-2 focus:ring-offset-[#0c0c0c] rounded-sm"
                onMouseEnter={() => handleTechHover(tech)}
                onMouseLeave={handleTechLeave}
                onClick={() => handleTechClick(tech)}
                onFocus={() => handleTechHover(tech)}
                onBlur={handleTechLeave}
                tabIndex={0}
                role="button"
                aria-label={`${tech.name} - ${tech.category}`}
              >
                <div
                  className={`font-hn transition-all duration-300 ${getTechSize(tech)} text-white/70 hover:text-white hover:scale-105`}
                  style={{
                    opacity: visibleSections.has(8) ? 1 : 0,
                    transform: visibleSections.has(8) ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${techIndex * 50}ms`
                  }}
                >
                  {tech.name}
                </div>
                
                {/* Hover/Click Tooltip */}
                {hoveredTech?.name === tech.name && (
                  <div className="absolute top-full left-0 mt-2 p-3 sm:p-4 bg-cream/10 backdrop-blur-sm border border-cream/20 rounded-sm z-10 w-full sm:w-64 opacity-100 transition-opacity duration-300">
                    <div className="font-hn text-xs text-white/60 mb-2">{tech.category}</div>
                    <div className="font-poppins font-hn text-[10px] text-white/40 mb-2">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 md:px-10 border-t border-cream/5">
        <div className="text-center max-w-4xl px-4">
          <h2 className="font-weghorst text-3xl sm:text-4xl md:text-6xl text-white mb-8 sm:mb-12">
            THE TOOLS<br />ARE ONLY<br />THE START.
          </h2>
          <p className="font-hn text-sm sm:text-base text-white/70 max-w-md mx-auto leading-relaxed mb-12 sm:mb-16">
            WHAT MATTERS<br />IS WHAT YOU<br />BUILD WITH THEM.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center">
            <Link
              to="/jobs"
              className="font-hn text-xs tracking-[0.22em] text-white hover:text-white/80 transition-colors duration-300"
            >
              JOBS →
            </Link>
            <Link
              to="/message"
              className="font-hn text-xs tracking-[0.22em] text-white hover:text-white/80 transition-colors duration-300"
            >
              MESSAGE →
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Metadata */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-5 sm:px-10 sm:pb-8 flex justify-between items-end text-xs sm:text-sm pointer-events-none z-40">
        <div className="font-poppins font-hn text-white/40">
          <div>SKILLS</div>
          <div className="mt-1">FRONTEND</div>
          <div>BACKEND</div>
          <div>MOBILE</div>
          <div>COMMERCE</div>
          <div>SYSTEMS</div>
        </div>
        <div className="font-poppins font-hn text-white/40 text-right">
          <div>BASED IN</div>
          <div className="mt-1">NIGERIA</div>
          <div>WORKING WORLDWIDE</div>
        </div>
      </div>
    </div>
  )
}