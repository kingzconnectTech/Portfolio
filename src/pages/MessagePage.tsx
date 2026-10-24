import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { useForm } from '@formspree/react'
import { MobileMenu } from '../components/nav/MobileMenu'
import { useSEO } from '../hooks/useSEO'

export function MessagePage() {
  const [state, handleSubmit] = useForm('xdeoqzdj')
  const formRef = useRef<HTMLFormElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  const currentYear = new Date().getFullYear()

  useSEO('message')

  // Page entry animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }
    )
    .fromTo('.main-headline',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.4'
    )
    .fromTo('.secondary-copy',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      '-=0.4'
    )
    .fromTo('.form-field',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
      '-=0.3'
    )
    .fromTo('.submit-button',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    )
    .fromTo('.metadata',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.3'
    )

    return () => {
      tl.kill()
    }
  }, [])

  // Success animation when form is submitted successfully
  useEffect(() => {
    if (state.succeeded) {
      gsap.to('.form-content', {
        opacity: 0,
        y: -20,
        duration: 0.5,
        onComplete: () => {
          gsap.fromTo('.success-content',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6 }
          )
        }
      })
    }
  }, [state.succeeded])

  if (state.succeeded) {
    return (
      <div
        ref={pageRef}
        className="fixed inset-0 flex h-[100dvh] w-full flex-col overflow-y-auto overscroll-y-contain bg-[#0c0c0c] lg:overflow-hidden"
      >
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <Link
            to="/"
            className="font-hn text-xs tracking-[0.26em] text-cream hover:text-white transition-opacity duration-300 hover:opacity-75 sm:text-sm font-semibold flex items-center gap-2"
            aria-label="Return to Home"
          >
            ← BACK
          </Link>
          <div className="hidden md:flex items-start gap-16 lg:gap-24">
            <div className="text-sm text-cream/60">{currentYear}</div>
            <nav aria-label="Primary" className="flex flex-col gap-0.5 text-sm">
              <Link to="/story" className="text-left text-cream/60 hover:text-cream duration-300">Story</Link>
              <Link to="/jobs" className="text-left text-cream/60 hover:text-cream duration-300">Jobs</Link>
              <Link to="/skills" className="text-left text-cream/60 hover:text-cream duration-300">Skills</Link>
              <span className="text-left text-cream">Message</span>
            </nav>
          </div>
          <MobileMenu activeLabel="Message" tone="cream" showSocial />
        </header>

        {/* Success Content */}
        <div className="success-content flex flex-1 items-center justify-center px-6 pb-10 pt-24 sm:px-10 lg:absolute lg:inset-0 lg:pb-0 lg:pt-0">
          <div className="max-w-2xl w-full">
            <div className="mb-8">
              <div className="font-hn text-[10px] tracking-[0.34em] mb-6" style={{ color: '#c4a574' }}>
                MESSAGE / 02
              </div>
              <h1 className="font-weghorst text-[clamp(3rem,6vw,5rem)] leading-[0.9] text-white">
                MESSAGE<br />RECEIVED.
              </h1>
            </div>
            <div className="space-y-4 mb-12">
              <p className="font-hn text-lg text-white/80">
                I'll get back to you
              </p>
              <p className="font-hn text-lg text-white/80">
                as soon as possible.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-hn text-xs tracking-[0.22em] text-white hover:text-white/80 duration-300 group"
            >
              BACK TO KINGZCONNECT
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="flex flex-col items-start gap-4 px-6 pb-6 text-xs sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-10 sm:pb-8 sm:text-sm lg:absolute lg:inset-x-0 lg:bottom-0">
          <div className="metadata font-hn text-cream/40">
            <div>AVAILABLE FOR</div>
            <div className="mt-1">WEB / MOBILE / ECOMMERCE</div>
            <div>DIGITAL PRODUCTS / CREATIVE TECHNOLOGY</div>
          </div>
          <div className="metadata font-hn text-cream/40 sm:text-right">
            <div>ABUJA / NIGERIA</div>
            <div className="mt-1">AVAILABLE WORLDWIDE</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={pageRef}
      className="fixed inset-0 flex h-[100dvh] w-full flex-col overflow-y-auto overscroll-y-contain bg-[#0c0c0c] lg:overflow-hidden"
    >
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-start justify-between px-6 pt-6 sm:px-10 sm:pt-8">
        <Link
          to="/"
          className="font-hn text-xs tracking-[0.26em] text-cream hover:text-white transition-opacity duration-300 hover:opacity-75 sm:text-sm font-semibold flex items-center gap-2"
          aria-label="Return to Home"
        >
          ← BACK
        </Link>
        <div className="hidden md:flex items-start gap-16 lg:gap-24">
          <div className="font-hn text-sm text-cream/60">{currentYear}</div>
          <nav aria-label="Primary" className="flex flex-col gap-0.5 text-sm">
            <Link to="/story" className="text-left text-cream/60 hover:text-cream duration-300">Story</Link>
            <Link to="/jobs" className="text-left text-cream/60 hover:text-cream duration-300">Jobs</Link>
            <Link to="/skills" className="text-left text-cream/60 hover:text-cream duration-300">Skills</Link>
            <span className="text-left text-cream relative">
              Message
              <span className="absolute bottom-0 left-0 right-0 h-px bg-cream" />
            </span>
          </nav>
        </div>
        <MobileMenu activeLabel="Message" tone="cream" showSocial />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center px-6 pb-10 pt-24 sm:px-10 lg:absolute lg:inset-0 lg:pb-0 lg:pt-0">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Side - Typography */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="main-headline font-weghorst text-[clamp(3rem,7vw,6rem)] leading-[0.9] text-white mb-8">
              HAVE AN<br />IDEA?
            </h1>
            <div className="secondary-copy space-y-4">
              <p className="font-hn text-sm tracking-[0.15em] text-white/80 uppercase">
                A PROJECT?
              </p>
              <p className="font-hn text-sm tracking-[0.15em] text-white/80 uppercase">
                A PRODUCT?
              </p>
              <p className="font-hn text-sm tracking-[0.15em] text-white/80 uppercase">
                SOMETHING ELSE?
              </p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-5 flex flex-col justify-center form-content">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="form-field">
                <label className="block font-hn text-[10px] tracking-[0.22em] text-white/60 mb-3">
                  01 / YOUR NAME
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="w-full bg-transparent font-hn text-white placeholder-white/40 outline-none border-b border-white/20 focus:border-white/60 transition-colors duration-300 py-2"
                />
              </div>

              {/* Email Field */}
              <div className="form-field">
                <label className="block font-hn text-[10px] tracking-[0.22em] text-white/60 mb-3">
                  02 / YOUR EMAIL
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  className="w-full bg-transparent font-hn text-white placeholder-white/40 outline-none border-b border-white/20 focus:border-white/60 transition-colors duration-300 py-2"
                />
              </div>

              {/* Message Field */}
              <div className="form-field">
                <label className="block font-hn text-[10px] tracking-[0.22em] text-white/60 mb-3">
                  03 / WHAT ARE WE BUILDING?
                </label>
                <textarea
                  name="message"
                  placeholder="Tell me about the project..."
                  rows={4}
                  className="w-full bg-transparent font-hn text-white placeholder-white/40 outline-none border-b border-white/20 focus:border-white/60 transition-colors duration-300 py-2 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={state.submitting}
                className="submit-button font-hn text-xs tracking-[0.22em] text-white hover:text-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group flex items-center gap-2"
              >
                {state.submitting ? 'SENDING...' : 'SEND MESSAGE'}
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Metadata */}
      <div className="flex items-end justify-between gap-6 px-6 pb-6 text-xs sm:px-10 sm:pb-8 sm:text-sm lg:absolute lg:inset-x-0 lg:bottom-0">
        <div className="metadata font-hn text-cream/40">
          <div>AVAILABLE FOR</div>
          <div className="mt-1">WEB / MOBILE / ECOMMERCE</div>
          <div>DIGITAL PRODUCTS / CREATIVE TECHNOLOGY</div>
        </div>
        <div className="metadata font-hn text-cream/40 text-right">
          <div>ABUJA / NIGERIA</div>
          <div className="mt-1">AVAILABLE WORLDWIDE</div>
        </div>
      </div>
    </div>
  )
}