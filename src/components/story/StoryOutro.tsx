import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storyFinal } from '../../data/story-images'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  reducedMotion: boolean
}

export function StoryOutro({ reducedMotion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center bg-[#0c0c0c] px-6"
    >
      <div
        ref={contentRef}
        className="text-center max-w-4xl"
        style={{ opacity: reducedMotion ? 1 : 0 }}
      >
        <h1 className="font-hn text-[10vw] leading-[0.9] tracking-[-0.03em] sm:text-[6vw] text-cream">
          {storyFinal.headline}
        </h1>
        <p className="mt-4 font-hn text-[8vw] leading-[0.9] tracking-[-0.02em] sm:text-[4vw] text-white">
          {storyFinal.subheadline}
        </p>
        <p className="mt-4 font-hn text-[8vw] leading-[0.9] tracking-[-0.02em] sm:text-[4vw] text-white">
          {storyFinal.finalLine}
        </p>

        <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link
            to="/"
            className="px-8 py-4 border border-cream/30 font-hn text-[11px] tracking-[0.22em] text-cream transition-colors hover:border-cream hover:bg-cream/5"
          >
            {storyFinal.cta2}
          </Link>
          <Link
            to="/"
            className="px-8 py-4 border border-cream/30 font-hn text-[11px] tracking-[0.22em] text-cream transition-colors hover:border-cream hover:bg-cream/5"
          >
            {storyFinal.cta1} →
          </Link>
        </div>
      </div>
    </section>
  )
}
