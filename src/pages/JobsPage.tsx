import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import type { CategoryId, PortfolioProject } from '../data/portfolio'
import { projectsByCategory, populatedCategories } from '../data/portfolio'
import { ProjectCard } from '../components/jobs/ProjectCard'
import { ProjectModal } from '../components/jobs/ProjectModal'
import { MobileMenu } from '../components/nav/MobileMenu'
import { useSEO } from '../hooks/useSEO'

interface OpenEntry {
  project: PortfolioProject
  role: string
}

export function JobsPage() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [filter, setFilter] = useState<CategoryId | 'all'>('all')
  const [openEntry, setOpenEntry] = useState<OpenEntry | null>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const currentYear = new Date().getFullYear()

  useSEO('jobs')

  // Only categories that actually contain work get a section and a filter button.
  const filters = useMemo(
    () => [
      { id: 'all' as const, label: 'ALL' },
      ...populatedCategories().map(category => ({ id: category.id, label: category.filterLabel })),
    ],
    [],
  )

  const visibleCategories = useMemo(() => {
    const available = populatedCategories()
    return filter === 'all' ? available : available.filter(category => category.id === filter)
  }, [filter])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Page entrance animation
  useEffect(() => {
    if (reducedMotion) return

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    tl.fromTo(pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }
    )
    .fromTo('.hero-headline',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.0 },
      '-=0.3'
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.5'
    )
    .fromTo('.category-item',
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 },
      '-=0.3'
    )
    .fromTo('.metadata',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.4'
    )

    return () => {
      tl.kill()
    }
  }, [reducedMotion])

  const openProject = (project: PortfolioProject, role: string, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setOpenEntry({ project, role })
  }

  const closeProject = () => {
    setOpenEntry(null)
    triggerRef.current?.focus()
  }

  return (
    <div ref={pageRef} className="relative min-h-screen w-full bg-[#0c0c0c]">
      {/* Header */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between bg-gradient-to-b from-[#0c0c0c] via-[#0c0c0c]/85 to-transparent px-6 pb-8 pt-6 sm:px-10 sm:pt-8">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link
            to="/"
            className="font-hn text-xs tracking-[0.26em] text-white hover:text-white/80 transition-opacity duration-300 hover:opacity-75 sm:text-sm font-semibold flex items-center gap-2"
            aria-label="Return to Home"
          >
            ← BACK
          </Link>
        </div>
        <div className="hidden md:flex items-start gap-16 lg:gap-24 pointer-events-auto">
          <div className="font-hn text-sm text-white/60">{currentYear}</div>
          <nav aria-label="Primary" className="flex flex-col gap-0.5 text-sm">
            <Link to="/story" className="text-left text-white/60 hover:text-white duration-300">Story</Link>
            <span className="text-left text-white relative">
              Jobs
              <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            </span>
            <Link to="/skills" className="text-left text-white/60 hover:text-white duration-300">Skills</Link>
            <Link to="/message" className="text-left text-white/60 hover:text-white duration-300">Message</Link>
          </nav>
        </div>
        <MobileMenu activeLabel="Jobs" tone="white" showSocial className="pointer-events-auto" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-28 sm:px-10 sm:pt-32 lg:pt-36">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column - Hero Typography (sticky on desktop) */}
          <div className="lg:col-span-5">
            <div className="flex flex-col lg:sticky lg:top-32 lg:min-h-[calc(100vh-11rem)]">
              <div>
                <h1 className="hero-headline font-weghorst text-[clamp(2.5rem,6vw,7rem)] leading-[0.85] text-white mb-6 sm:mb-8">
                  THE WORK<br />BEHIND<br />THE WORK.
                </h1>
                <p className="hero-subtitle font-hn text-sm text-white/70 max-w-md leading-relaxed">
                  A record of the products, platforms<br />and digital experiences I've built.
                </p>
              </div>

              <div className="mt-10 flex items-end justify-between gap-6 lg:mt-auto">
                <div className="metadata font-hn text-xs text-cream/40 sm:text-sm">
                  <div>EXPERIENCE</div>
                  <div className="mt-1">WEB</div>
                  <div>PRODUCT</div>
                  <div>MOBILE</div>
                  <div>E-COMMERCE</div>
                  <div>CREATIVE TECHNOLOGY</div>
                </div>
                <div className="metadata font-hn text-xs text-cream/40 text-right sm:text-sm">
                  <div>BASED IN</div>
                  <div className="mt-1">NIGERIA</div>
                  <div>WORKING WORLDWIDE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Category sections with project cards */}
          <div className="lg:col-span-7">
            {/* Filter bar */}
            <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-white/[0.07] pb-4">
              {filters.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  className={`font-hn text-[10px] uppercase tracking-[0.24em] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                    filter === item.id ? 'text-white' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div key={filter} className="animate-fade-in">
              {visibleCategories.map(category => {
                const items = projectsByCategory(category.id)

                return (
                  <section key={category.id} className="category-item mb-16 last:mb-0">
                    <h2 className="font-hn text-xl text-white sm:text-2xl">
                      {category.title}
                    </h2>
                    <div className="mt-1 mb-6 font-hn text-xs tracking-[0.15em] text-white/60">
                      {category.role}
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 sm:gap-6">
                      {items.map(project => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          role={category.role}
                          reducedMotion={reducedMotion}
                          onOpen={(p, trigger) => openProject(p, category.role, trigger)}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}

              {/* Closing statement */}
              <div className="category-item border-t border-white/10 pt-10">
                <h3 className="hero-headline font-weghorst text-2xl leading-tight text-white sm:text-3xl">
                  STILL BUILDING.<br />
                  STILL LEARNING.<br />
                  STILL MOVING.
                </h3>
                <Link
                  to="/message"
                  className="mt-4 inline-flex items-center gap-2 font-hn text-xs tracking-[0.22em] text-white hover:text-white/80 duration-300 cursor-pointer"
                >
                  MESSAGE →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {openEntry && (
        <ProjectModal
          key={`${openEntry.project.id}-${openEntry.role}`}
          project={openEntry.project}
          role={openEntry.role}
          onClose={closeProject}
        />
      )}
    </div>
  )
}
