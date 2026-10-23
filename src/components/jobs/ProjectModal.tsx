import { useCallback, useEffect, useRef, useState } from 'react'
import type { PortfolioProject } from '../../data/portfolio'
import { stackGroupLabels, stackGroupOrder, statusLabels, typeLabels } from '../../data/portfolio'
import { TechChip } from './TechChip'

interface ProjectModalProps {
  project: PortfolioProject
  /** Role label of the section the project was opened from. */
  role: string
  onClose: () => void
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

export function ProjectModal({ project, role, onClose }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [index, setIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({})
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

  const images = project.images
  const hasGallery = images.length > 1
  const currentSrc = images[index]
  const showImage = Boolean(currentSrc) && !failedImages[index]

  const goTo = useCallback(
    (next: number) => {
      if (images.length === 0) return
      setIndex(((next % images.length) + images.length) % images.length)
    },
    [images.length],
  )

  // Lock background scroll while the dialog is open.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  // Esc to close, Tab cycles inside the panel.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key === 'ArrowRight' && hasGallery) {
        goTo(index + 1)
        return
      }
      if (event.key === 'ArrowLeft' && hasGallery) {
        goTo(index - 1)
        return
      }
      if (event.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [goTo, hasGallery, index, onClose])

  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  const hasUrl = Boolean(project.url) && project.status !== 'private'
  const stackGroups = stackGroupOrder.filter(group => project.stack[group].length > 0)

  return (
    <div
      className="fixed inset-0 z-[80] animate-fade-in overflow-y-auto bg-black/75 backdrop-blur-md"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-modal-title-${project.id}`}
          className="animate-fade-up relative w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0f0f0f] p-4 sm:p-8"
        >
          {/* Close */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 font-hn text-sm text-white/70 transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 sm:right-5 sm:top-5"
          >
            ✕
          </button>

          {/* Gallery */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            {!showImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent">
                <span className="font-weghorst text-5xl text-white/25 sm:text-7xl">
                  {initialsFor(project.name)}
                </span>
              </div>
            )}

            {showImage && !loadedImages[index] && (
              <div className="absolute inset-0 animate-pulse bg-white/[0.05]" aria-hidden="true" />
            )}

            {showImage && (
              <img
                src={currentSrc}
                alt={`${project.name} — ${role} project screenshot ${index + 1}`}
                decoding="async"
                onLoad={() => setLoadedImages(prev => ({ ...prev, [index]: true }))}
                onError={() => setFailedImages(prev => ({ ...prev, [index]: true }))}
                className={`h-full w-full object-cover object-top transition-opacity duration-500 ${
                  loadedImages[index] ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {hasGallery && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous screenshot"
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 font-hn text-sm text-white/70 transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Next screenshot"
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 font-hn text-sm text-white/70 transition-colors duration-300 hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                >
                  →
                </button>
              </>
            )}
          </div>

          {hasGallery && (
            <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
              {images.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show screenshot ${i + 1}`}
                    aria-current={i === index}
                    className={`block h-12 w-20 overflow-hidden rounded-md border bg-white/[0.03] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 ${
                      i === index ? 'border-white/50' : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Meta */}
          <h2
            id={`project-modal-title-${project.id}`}
            className="mt-6 font-hn text-xl font-medium uppercase tracking-[0.06em] text-white sm:text-2xl"
          >
            {project.name}
          </h2>
          <div className="mt-2 font-hn text-[10px] uppercase tracking-[0.2em] text-white/45">
            {role}
            <span className="px-1.5 text-white/20">·</span>
            {project.year}
            <span className="px-1.5 text-white/20">·</span>
            {statusLabels[project.status]}
          </div>

          <p className="mt-5 max-w-2xl font-hn text-sm leading-relaxed text-white/60">
            {project.longDescription}
          </p>

          {/* Stack by group */}
          {stackGroups.length > 0 && (
            <div className="mt-6 space-y-4">
              {stackGroups.map(group => (
                <div key={group}>
                  <h3 className="font-hn text-[9px] uppercase tracking-[0.24em] text-white/35">
                    {stackGroupLabels[group]}
                  </h3>
                  <ul className="mt-2 flex list-none flex-wrap gap-1.5 p-0">
                    {project.stack[group].map(item => (
                      <TechChip key={item} label={item} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {(hasUrl || project.repo) && (
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-6">
              {hasUrl && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-hn text-[10px] uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                >
                  Visit live site →
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-hn text-[10px] uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                >
                  View source →
                </a>
              )}
            </div>
          )}

          <div className="mt-6 font-hn text-[9px] uppercase tracking-[0.2em] text-white/30">
            {typeLabels[project.type]}
          </div>
        </div>
      </div>
    </div>
  )
}
