import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import kingzconnectPortrait from '../assets/Kingzconnect.png'
import logoSrc from '../assets/Logo.png'
import { projects } from '../data/projects'
import { NAV_ITEMS, SOCIAL_LINKS } from '../data/nav'
import { MobileMenu } from '../components/nav/MobileMenu'
import { useSEO } from '../hooks/useSEO'

type Overlay = 'none' | 'projects'

export function HomePage() {
  const [overlay, setOverlay] = useState<Overlay>('none')
  const currentYear = new Date().getFullYear()

  useSEO('home')

  useEffect(() => {
    if (overlay !== 'none') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [overlay])

  return (
    <>
      <section className="viewport-fill relative w-full overflow-hidden bg-black">
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

        {/* Front portrait - z-20, pointer-events none.
            Centred with auto margins rather than a translate: the rise-in keyframes
            animate `transform`, and with fill-mode `both` they would overwrite a
            translate utility once the animation finished. */}
        <img
          alt="Portrait"
          src={kingzconnectPortrait}
          className="absolute inset-x-0 bottom-16 sm:bottom-0 z-20 mx-auto h-auto w-[86%] sm:w-[82%] max-h-[100%] sm:max-h-[100%] object-contain object-bottom pointer-events-none anim-rise-in"
          style={{ animationDelay: '300ms' }}
        />

        {/* Header - z-30 */}
        <header className="absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <a href="#" className="anim-fade-up" style={{ animationDelay: '800ms' }}>
            <img src={logoSrc} alt="kingzconnect" className="h-9 sm:h-11 w-auto object-contain" />
          </a>

          <div className="hidden md:flex items-start gap-16 lg:gap-24">
            <div className="text-sm text-cream anim-fade-up" style={{ animationDelay: '900ms' }}>
              {currentYear}
            </div>
            <nav aria-label="Primary" className="flex flex-col gap-0.5 text-sm">
              {NAV_ITEMS.map((item, i) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-left text-cream opacity-100 hover:opacity-60 duration-300 anim-fade-up"
                  style={{ animationDelay: `${1000 + i * 80}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Social" className="flex flex-col gap-0.5 text-sm">
              {SOCIAL_LINKS.map((link, i) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream opacity-100 hover:opacity-60 duration-300 anim-fade-up"
                  style={{ animationDelay: `${1150 + i * 80}ms` }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <MobileMenu tone="cream" showSocial />
        </header>

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
