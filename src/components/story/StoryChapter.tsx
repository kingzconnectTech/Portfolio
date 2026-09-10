import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { StoryChapter as StoryChapterType } from '../../data/story-images'
import { PlaceholderImage } from './PlaceholderImage'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  chapter: StoryChapterType
  reducedMotion: boolean
}

export function StoryChapter({ chapter, reducedMotion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current || reducedMotion) return

    const ctx = gsap.context(() => {
      // Image animation
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            opacity: 0,
            scale: 1.05,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }

      // Content animation
      if (contentRef.current) {
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
            delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, containerRef)

    return () => ctx.revert()
  }, [chapter.id, reducedMotion])

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageLoaded(true) // Show placeholder on error
  }

  const renderLayout = () => {
    switch (chapter.layout) {
      case 'full-bleed':
        return (
          <div className="relative min-h-screen">
            <img
              ref={imageRef}
              src={chapter.image}
              alt={chapter.imageAlt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: reducedMotion || imageLoaded ? 1 : 0 }}
            />
            {!imageLoaded && (
              <PlaceholderImage
                chapterNumber={chapter.number}
                chapterTitle={chapter.title}
                className="absolute inset-0 w-full h-full"
              />
            )}
            <div className="absolute inset-0 bg-black/40" />
            <div
              ref={contentRef}
              className="relative z-10 flex flex-col justify-end min-h-screen px-6 pb-20 sm:px-12 sm:pb-32"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              <div className="max-w-4xl">
                <div className="font-hn text-[11px] tracking-[0.28em] text-amber-story/80 sm:text-xs" style={{ color: '#c4a574' }}>
                  {chapter.number}
                </div>
                <h2 className="mt-2 font-hn text-3xl tracking-[-0.02em] sm:text-5xl text-cream">
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="mt-1 font-hn text-xs tracking-[0.18em] text-cream/50 sm:text-sm">
                    {chapter.subtitle}
                  </p>
                )}
                <div className="mt-6 space-y-2">
                  {chapter.content.map((line) => (
                    <p
                      key={line}
                      className="font-hn text-base leading-relaxed sm:text-lg text-cream/80"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'split':
        return (
          <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="relative lg:h-screen">
              <img
                ref={imageRef}
                src={chapter.image}
                alt={chapter.imageAlt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: reducedMotion || imageLoaded ? 1 : 0 }}
              />
              {!imageLoaded && (
                <PlaceholderImage
                  chapterNumber={chapter.number}
                  chapterTitle={chapter.title}
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
            <div
              ref={contentRef}
              className="flex flex-col justify-center px-6 py-20 lg:px-12 lg:py-0 bg-[#0c0c0c]"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              <div className="max-w-lg">
                <div className="font-hn text-[11px] tracking-[0.28em] text-amber-story/80 sm:text-xs" style={{ color: '#c4a574' }}>
                  {chapter.number}
                </div>
                <h2 className="mt-2 font-hn text-3xl tracking-[-0.02em] sm:text-4xl text-cream">
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="mt-1 font-hn text-xs tracking-[0.18em] text-cream/50 sm:text-sm">
                    {chapter.subtitle}
                  </p>
                )}
                <div className="mt-6 space-y-3">
                  {chapter.content.map((line) => (
                    <p
                      key={line}
                      className="font-hn text-base leading-relaxed sm:text-lg text-cream/70"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'text-overlay':
        return (
          <div className="relative min-h-screen flex items-center justify-center">
            <img
              ref={imageRef}
              src={chapter.image}
              alt={chapter.imageAlt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: reducedMotion || imageLoaded ? 1 : 0 }}
            />
            {!imageLoaded && (
              <PlaceholderImage
                chapterNumber={chapter.number}
                chapterTitle={chapter.title}
                className="absolute inset-0 w-full h-full"
              />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div
              ref={contentRef}
              className="relative z-10 text-center px-6"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              <div className="max-w-3xl">
                <div className="font-hn text-[11px] tracking-[0.28em] text-amber-story/80 sm:text-xs" style={{ color: '#c4a574' }}>
                  {chapter.number}
                </div>
                <h2 className="mt-2 font-hn text-3xl tracking-[-0.02em] sm:text-5xl text-cream">
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="mt-1 font-hn text-xs tracking-[0.18em] text-cream/50 sm:text-sm">
                    {chapter.subtitle}
                  </p>
                )}
                <div className="mt-6 space-y-2">
                  {chapter.content.map((line) => (
                    <p
                      key={line}
                      className="font-hn text-base leading-relaxed sm:text-lg text-cream/80"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'image-focus':
      default:
        return (
          <div className="min-h-screen flex flex-col">
            <div className="relative h-[65vh] lg:h-[75vh]">
              <img
                ref={imageRef}
                src={chapter.image}
                alt={chapter.imageAlt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: reducedMotion || imageLoaded ? 1 : 0 }}
              />
              {!imageLoaded && (
                <PlaceholderImage
                  chapterNumber={chapter.number}
                  chapterTitle={chapter.title}
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
            <div
              ref={contentRef}
              className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 lg:py-16 bg-[#0c0c0c]"
              style={{ opacity: reducedMotion ? 1 : 0 }}
            >
              <div className="max-w-3xl">
                <div className="font-hn text-[11px] tracking-[0.28em] text-amber-story/80 sm:text-xs" style={{ color: '#c4a574' }}>
                  {chapter.number}
                </div>
                <h2 className="mt-2 font-hn text-3xl tracking-[-0.02em] sm:text-4xl text-cream">
                  {chapter.title}
                </h2>
                {chapter.subtitle && (
                  <p className="mt-1 font-hn text-xs tracking-[0.18em] text-cream/50 sm:text-sm">
                    {chapter.subtitle}
                  </p>
                )}
                <div className="mt-6 space-y-3">
                  {chapter.content.map((line) => (
                    <p
                      key={line}
                      className="font-hn text-base leading-relaxed sm:text-lg text-cream/70"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <section
      ref={containerRef}
      id={chapter.id}
      className="relative overflow-hidden"
    >
      {renderLayout()}
    </section>
  )
}
