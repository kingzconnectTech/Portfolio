import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import kingzconnectPortrait from '../assets/Kingzconnect.png'
import logoSrc from '../assets/Logo.png'
import { projects } from '../data/projects'

const navLinks = ['Story', 'Jobs', 'Skills', 'Message'] as const
const socialLinks = ['Instagram', 'TikTok', 'LinkedIn']

type Overlay = 'none' | 'projects'

export function HomePage() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [overlay, setOverlay] = useState<Overlay>('none')
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    if (drawerOpen || overlay !== 'none') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, overlay])

  const handleNav = useCallback(
    (link: (typeof navLinks)[number]) => {
      if (link === 'Story' || link === 'Message' || link === 'Jobs' || link === 'Skills') {
        // Story, Message, Jobs, and Skills are now separate routes, handled by Link
        return
      }
      setDrawerOpen(false)
    },
    [],
  )

  return (
    <>
      <section className="relative h-[100dvh] w-full overflow-hidden bg-black">
        {/* BG image - default z */}
        <img
          alt=""
          src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260729_022513_486985a2-ac8c-4278-91a8-071dcd9fcaff.png&w=1280&q=85"
          className="absolute inset-0 h-full w-full object-cover anim-fade-in"
          style={{ animationDelay: '0ms' }}
        />

        {/* Marquee - z-10 */}
        <div
          className="absolute inset-x-0 top-[16vh] sm:top-[14vh] z-10 overflow-hidden anim-fade-up"
          style={{ animationDelay: '500ms' }}
        >
          <div className="marquee animate-marquee flex w-max whitespace-nowrap font-weghorst text-[16vh] sm:text-[26vh] leading-none text-cream">
            {[0, 1].map((half) => (
              <div key={half} className="flex">
                <span className="pr-[6vw]">KingzConnect</span>
                <span className="pr-[6vw]">&nbsp;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cream rule - z-10 */}
        <div
          className="absolute inset-x-6 sm:inset-x-10 bottom-[5.5rem] sm:bottom-28 z-10 h-0.5 bg-cream origin-left anim-line"
          style={{ animationDelay: '1200ms' }}
        />

        {/* Footer - z-30 on mobile (with header), sm:z-10 on desktop */}
        <footer className="absolute inset-x-0 bottom-0 z-30 sm:z-10 flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-8 text-xs sm:text-sm leading-relaxed font-hn text-cream">
          <div className="anim-fade-up" style={{ animationDelay: '1400ms' }}>
            <div>Visuals Composer</div>
            <div>Digital Crafter</div>
            <div>Obsessed by The Office</div>
          </div>
          <div className="text-right anim-fade-up" style={{ animationDelay: '1550ms' }}>
            <div>A homage to</div>
            <div>Late Elder and Mrs Idika Kalu</div>
          </div>
        </footer>

        {/* Front portrait - z-20, pointer-events none */}
        <img
          alt="Portrait"
          src={kingzconnectPortrait}
          className="absolute left-1/2 bottom-0 -translate-x-1/2 z-20 h-auto w-[86%] sm:w-[82%] max-h-[100%] sm:max-h-[100%] object-contain object-bottom pointer-events-none anim-rise-in"
          style={{ animationDelay: '300ms' }}
        />

        {/* Header - z-30 */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <a href="#" className="anim-fade-up" style={{ animationDelay: '800ms' }}>
            <img src={logoSrc} alt="Marcus — Bennet" className="h-9 sm:h-11 w-auto object-contain" />
          </a>

          <div className="hidden sm:flex items-start gap-16 lg:gap-24">
            <div className="text-sm text-cream anim-fade-up" style={{ animationDelay: '900ms' }}>
              {currentYear}
            </div>
            <nav className="flex flex-col gap-0.5 text-sm">
              {navLinks.map((link, i) => {
                const routeMap: Record<string, string> = {
                  'Story': '/story',
                  'Message': '/message',
                  'Jobs': '/jobs',
                  'Skills': '/skills'
                }
                
                return routeMap[link] ? (
                  <Link
                    key={link}
                    to={routeMap[link]}
                    className="text-left text-cream opacity-100 hover:opacity-60 duration-300 anim-fade-up"
                    style={{ animationDelay: `${1000 + i * 80}ms` }}
                  >
                    {link}
                  </Link>
                ) : (
                  <button
                    key={link}
                    type="button"
                    onClick={() => handleNav(link)}
                    className="text-left text-cream opacity-100 hover:opacity-60 duration-300 anim-fade-up"
                    style={{ animationDelay: `${1000 + i * 80}ms` }}
                  >
                    {link}
                  </button>
                )
              })}
            </nav>
            <nav className="flex flex-col gap-0.5 text-sm">
              {socialLinks.map((link, i) => (
                <a
                  key={link}
                  href="#"
                  className="text-cream opacity-100 hover:opacity-60 duration-300 anim-fade-up"
                  style={{ animationDelay: `${1150 + i * 80}ms` }}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <button
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="sm:hidden z-50 relative h-10 w-10 flex items-center justify-center anim-fade-up"
            style={{ animationDelay: '900ms' }}
          >
            <div className="relative h-4 w-6 flex flex-col justify-between">
              <span
                className="block h-[2px] w-full bg-cream transition-transform duration-500 origin-center"
                style={{
                  transform: drawerOpen ? 'translateY(7px) rotate(45deg)' : 'translateY(0) rotate(0)',
                  transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
                }}
              />
              <span
                className="block h-[2px] w-full bg-cream transition-opacity duration-300"
                style={{ opacity: drawerOpen ? 0 : 1 }}
              />
              <span
                className="block h-[2px] w-full bg-cream transition-transform duration-500 origin-center"
                style={{
                  transform: drawerOpen ? 'translateY(-7px) rotate(-45deg)' : 'translateY(0) rotate(0)',
                  transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
                }}
              />
            </div>
          </button>
        </header>

        <div
          className={`sm:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
            drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setDrawerOpen(false)}
        />

        <aside
          className={`sm:hidden fixed top-0 right-0 z-40 w-[80%] max-w-sm h-full bg-[#141414] px-8 py-10 transition-transform duration-[600ms] ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)' }}
        >
          <button
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute right-6 top-6 z-50 text-cream transition-all duration-500"
            style={{
              opacity: drawerOpen ? 1 : 0,
              transform: drawerOpen ? 'rotate(0deg)' : 'rotate(90deg)',
              transitionDelay: drawerOpen ? '300ms' : '0ms',
            }}
          >
            <X size={26} strokeWidth={1.5} />
          </button>

          <div className="mt-10">
            <div
              className="uppercase tracking-[0.2em] text-cream/50 text-xs mb-6 transition-all duration-500"
              style={{
                opacity: drawerOpen ? 1 : 0,
                transform: drawerOpen ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: drawerOpen ? '250ms' : '0ms',
              }}
            >
              Site Index
            </div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => {
                const routeMap: Record<string, string> = {
                  'Story': '/story',
                  'Message': '/message',
                  'Jobs': '/jobs',
                  'Skills': '/skills'
                }
                
                return routeMap[link] ? (
                  <Link
                    key={link}
                    to={routeMap[link]}
                    onClick={() => setDrawerOpen(false)}
                    className="text-left font-hn text-4xl text-cream transition-all duration-500"
                    style={{
                      opacity: drawerOpen ? 1 : 0,
                      transform: drawerOpen ? 'translateY(0)' : 'translateY(24px)',
                      transitionDelay: drawerOpen ? `${300 + i * 80}ms` : '0ms',
                    }}
                  >
                    {link}
                  </Link>
                ) : (
                  <button
                    key={link}
                    type="button"
                    onClick={() => handleNav(link)}
                    className="text-left font-hn text-4xl text-cream transition-all duration-500"
                    style={{
                      opacity: drawerOpen ? 1 : 0,
                      transform: drawerOpen ? 'translateY(0)' : 'translateY(24px)',
                      transitionDelay: drawerOpen ? `${300 + i * 80}ms` : '0ms',
                    }}
                  >
                    {link}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="mt-14">
            <div
              className="uppercase tracking-[0.2em] text-cream/50 text-xs mb-5 transition-all duration-500"
              style={{
                opacity: drawerOpen ? 1 : 0,
                transform: drawerOpen ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: drawerOpen ? '500ms' : '0ms',
              }}
            >
              Find Me
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-3">
              {socialLinks.map((link, i) => (
                <a
                  key={link}
                  href="#"
                  className="font-hn text-sm text-cream transition-all duration-500"
                  style={{
                    opacity: drawerOpen ? 1 : 0,
                    transform: drawerOpen ? 'translateY(0)' : 'translateY(16px)',
                    transitionDelay: drawerOpen ? `${550 + i * 60}ms` : '0ms',
                  }}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </section>

      {/* Lightweight projects bridge — Story CTA lands here until a full Projects experience exists */}
      {overlay === 'projects' && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-4 backdrop-blur-md sm:items-center">
          <div className="max-h-[85dvh] w-full max-w-lg overflow-y-auto border border-cream/15 bg-[#12100e] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-hn text-[10px] tracking-[0.22em] text-cream/45">KINGZCONNECT</div>
                <h2 className="mt-2 font-hn text-2xl text-cream sm:text-3xl">What I&apos;m Building</h2>
              </div>
              <button
                type="button"
                onClick={() => setOverlay('none')}
                className="font-hn text-xs tracking-[0.14em] text-cream/55 hover:text-cream"
              >
                CLOSE
              </button>
            </div>
            <ul className="mt-8 space-y-5">
              {projects.map((project) => (
                <li key={project.id} className="border-t border-cream/10 pt-5">
                  <div className="font-hn text-[10px] tracking-[0.18em]" style={{ color: '#c4a574' }}>
                    {project.category}
                  </div>
                  <div className="mt-1 font-hn text-lg text-cream">{project.name}</div>
                  <p className="mt-2 font-hn text-sm leading-relaxed text-cream/55">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span key={t} className="border border-cream/12 px-2 py-0.5 font-hn text-[10px] text-cream/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-hn text-[11px] leading-relaxed text-cream/35">
              Project entries are data-driven placeholders — replace content in{' '}
              <code className="text-cream/50">src/data/projects.ts</code>.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
