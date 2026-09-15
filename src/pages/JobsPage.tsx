import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { experienceCategories } from '../data/experience'

export function JobsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  
  const pageRef = useRef<HTMLDivElement>(null)
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])

  const currentYear = new Date().getFullYear()

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
    .fromTo('.jobs-label',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
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
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.12 },
      '-=0.3'
    )
    .fromTo('.metadata',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.4'
    )

    const cleanup = () => {
      tl.kill()
    }

    return cleanup
  }, [reducedMotion])

  const handleCategoryHover = (id: number) => {
    if (reducedMotion) {
      setExpandedId(id)
      return
    }

    setExpandedId(id)

    const categoryElement = categoryRefs.current[id - 1]
    if (categoryElement) {
      // Animate category expansion
      gsap.to(categoryElement, {
        paddingLeft: '1.5rem',
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out'
      })

      // Animate project names to become more prominent
      const projectElements = categoryElement.querySelectorAll('.project-name')
      projectElements.forEach((el: Element) => {
        gsap.to(el, {
          color: 'rgba(255, 255, 255, 0.9)',
          opacity: 1,
          duration: 0.3
        })
      })
    }
  }

  const handleCategoryLeave = () => {
    if (reducedMotion) {
      setExpandedId(null)
      return
    }

    const prevExpandedId = expandedId
    setExpandedId(null)

    if (prevExpandedId !== null) {
      const categoryElement = categoryRefs.current[prevExpandedId - 1]
      if (categoryElement) {
        // Animate category contraction
        gsap.to(categoryElement, {
          paddingLeft: '0',
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        })

        // Animate project names back to subtle
        const projectElements = categoryElement.querySelectorAll('.project-name')
        projectElements.forEach((el: Element) => {
          gsap.to(el, {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 0.7,
            duration: 0.3
          })
        })
      }
    }
  }

  return (
    <div
      ref={pageRef}
      className="fixed inset-0 w-screen h-[100dvh] bg-[#0c0c0c] overflow-hidden"
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8 pointer-events-none">
        <div className="flex items-center gap-6 pointer-events-auto">
          <Link
            to="/"
            className="font-hn text-xs tracking-[0.26em] text-white hover:text-white/80 transition-opacity duration-300 hover:opacity-75 sm:text-sm font-semibold flex items-center gap-2"
            aria-label="Return to Home"
          >
            ← BACK
          </Link>
          <div className="jobs-label font-hn text-[10px] tracking-[0.34em] text-white/60">
            JOBS / 01
          </div>
        </div>
        <div className="hidden sm:flex items-start gap-16 lg:gap-24 pointer-events-auto">
          <div className="font-hn text-sm text-white/60">{currentYear}</div>
          <nav className="flex flex-col gap-0.5 text-sm">
            <Link to="/story" className="text-left text-white/60 hover:text-white duration-300">Story</Link>
            <span className="text-left text-white relative">
              Jobs
              <span className="absolute bottom-0 left-0 right-0 h-px bg-white" />
            </span>
            <Link to="/skills" className="text-left text-white/60 hover:text-white duration-300">Skills</Link>
            <Link to="/message" className="text-left text-white/60 hover:text-white duration-300">Message</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="absolute inset-0 flex items-center px-6 sm:px-10 z-10">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Side - Hero Typography */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h1 className="hero-headline font-weghorst text-[clamp(2.5rem,6vw,7rem)] leading-[0.85] text-white mb-8">
              THE WORK<br />BEHIND<br />THE WORK.
            </h1>
            <p className="hero-subtitle font-hn text-sm text-white/70 max-w-md leading-relaxed">
              A record of the products, platforms<br />and digital experiences I've built.
            </p>
          </div>

          {/* Right Side - Experience Categories */}
          <div className="lg:col-span-7 flex flex-col justify-start space-y-8 max-h-[85vh] overflow-y-auto pr-2 scrollbar-hide pt-8">
            {experienceCategories.map((category, index) => {
              const isExpanded = expandedId === category.id

              return (
                <div
                  key={category.id}
                  ref={el => categoryRefs.current[index] = el}
                  className="category-item relative"
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={handleCategoryLeave}
                >
                  {/* Category Title */}
                  <h3 className="font-hn text-xl sm:text-2xl text-white mb-1">
                    {category.title}
                  </h3>

                  {/* Role */}
                  <div className="font-hn text-xs text-white/60 tracking-[0.15em] mb-3">
                    {category.role}
                  </div>

                  {/* Projects */}
                  <div className="space-y-1 mb-3">
                    {category.projects.map((project, projectIndex) => (
                      <div
                        key={projectIndex}
                        className="project-name font-hn text-sm text-white/70 opacity-70 transition-all duration-300"
                      >
                        {project.name}
                      </div>
                    ))}
                  </div>

                  {/* Expandable Details */}
                  <div
                    className="overflow-hidden transition-all duration-500 ease-out"
                    style={{
                      maxHeight: isExpanded ? '300px' : '0px',
                      opacity: isExpanded ? 1 : 0
                    }}
                  >
                    <p className="font-hn text-xs text-white/60 leading-relaxed mb-3 max-w-lg">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="font-hn text-[10px] text-white/40 tracking-[0.1em]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* TODAY Section */}
            <div className="category-item pt-8 border-t border-white/10 relative z-10">
              <h3 className="hero-headline font-weghorst text-2xl sm:text-3xl text-white mb-4 leading-tight">
                STILL BUILDING.<br />
                STILL LEARNING.<br />
                STILL MOVING.
              </h3>
              <Link
                to="/message"
                className="inline-flex items-center gap-2 font-hn text-xs tracking-[0.22em] text-white hover:text-white/80 duration-300 group cursor-pointer"
              >
                MESSAGE →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 sm:px-10 sm:pb-8 flex justify-between items-end text-xs sm:text-sm">
        <div className="metadata font-hn text-cream/40">
          <div>EXPERIENCE</div>
          <div className="mt-1">WEB</div>
          <div>PRODUCT</div>
          <div>MOBILE</div>
          <div>E-COMMERCE</div>
          <div>CREATIVE TECHNOLOGY</div>
        </div>
        <div className="metadata font-hn text-cream/40 text-right">
          <div>BASED IN</div>
          <div className="mt-1">NIGERIA</div>
          <div>WORKING WORLDWIDE</div>
        </div>
      </div>
    </div>
  )
}