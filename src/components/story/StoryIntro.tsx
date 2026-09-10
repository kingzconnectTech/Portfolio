import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import kingzconnectPortrait from '../../assets/Kingzconnect.png'
import { PlaceholderImage } from './PlaceholderImage'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  reducedMotion: boolean
}

export function StoryIntro({ reducedMotion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return

    const ctx = gsap.context(() => {
      // Image animation
      gsap.fromTo(
        imageRef.current,
        {
          opacity: 0,
          scale: 1.1,
          y: 30,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out',
        }
      )

      // Text animation
      gsap.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.3,
          ease: 'power2.out',
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [reducedMotion, imageLoaded])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageLoaded(true)
  }

  return (
    <section
      ref={containerRef}
      id="intro"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0c0c0c]" />

      {/* Portrait Image */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6">
        <div className="relative w-[86%] sm:w-[82%] max-w-4xl mb-8">
          <img
            ref={imageRef}
            src={kingzconnectPortrait}
            alt="KingzConnect - The Developer"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="w-full h-auto object-contain"
            style={{ opacity: reducedMotion || imageLoaded ? 1 : 0 }}
          />
          {!imageLoaded && (
            <PlaceholderImage
              chapterNumber="00"
              chapterTitle="INTRO"
              className="absolute inset-0 w-full h-full"
            />
          )}
        </div>

        {/* Text Content */}
        <div
          ref={textRef}
          className="text-center mt-8"
          style={{ opacity: reducedMotion ? 1 : 0 }}
        >
          <h1 className="font-hn text-[11vw] leading-[0.92] tracking-[-0.03em] sm:text-[5.5vw] whitespace-pre-line text-cream">
            THIS ISN'T JUST
            A PORTFOLIO.
          </h1>
          <p className="mt-6 max-w-md font-hn text-sm text-cream/55 sm:text-base">
            IT'S THE STORY BEHIND THE WORK.
          </p>
          <div className="mt-8 font-hn text-lg tracking-[0.15em] sm:text-xl" style={{ color: '#c4a574' }}>
            KINGZCONNECT
          </div>
          <div className="mt-12 flex flex-col items-center gap-2">
            <span className="font-hn text-[10px] tracking-[0.28em] text-cream/45 sm:text-[11px]">
              SCROLL TO BEGIN
            </span>
            <span className="text-cream/40 text-2xl animate-bounce">↓</span>
          </div>
        </div>
      </div>
    </section>
  )
}
