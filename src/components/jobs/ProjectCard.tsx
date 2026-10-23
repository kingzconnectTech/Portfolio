import { useState } from 'react'
import type { PortfolioProject } from '../../data/portfolio'
import { statusLabels, stackPreview, typeLabels } from '../../data/portfolio'
import { TechChip } from './TechChip'

interface ProjectCardProps {
  project: PortfolioProject
  /** Role label of the section the card is rendered in. */
  role: string
  reducedMotion: boolean
  onOpen: (project: PortfolioProject, trigger: HTMLElement) => void
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

export function ProjectCard({ project, role, reducedMotion, onOpen }: ProjectCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  const cover = project.images[0]
  const showImage = Boolean(cover) && !failed
  const hasUrl = Boolean(project.url) && project.status !== 'private'
  const chips = stackPreview(project)

  const cardMotion = reducedMotion ? '' : 'hover:-translate-y-1'
  const mediaMotion = reducedMotion ? '' : 'group-hover:object-bottom group-hover:scale-[1.03]'

  return (
    <article
      className={`group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-[transform,border-color,background-color] duration-300 ease-out hover:border-white/20 hover:bg-white/[0.04] sm:p-4 ${cardMotion}`}
    >
      {/* The media block is a button: it opens the modal and is natively
          keyboard-operable (Enter / Space). The VISIT link sits outside it. */}
      <button
        type="button"
        onClick={event => onOpen(project, event.currentTarget)}
        aria-label={`View details for ${project.name}`}
        className="block w-full rounded-lg text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0c0c]"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
          {!showImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-transparent">
              <span className="font-weghorst text-3xl text-white/25 sm:text-4xl">
                {initialsFor(project.name)}
              </span>
            </div>
          )}

          {showImage && !loaded && (
            <div className="absolute inset-0 animate-pulse bg-white/[0.05]" aria-hidden="true" />
          )}

          {showImage && (
            <img
              src={cover}
              alt={`${project.name} — ${role} project screenshot`}
              loading="lazy"
              decoding="async"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={`h-full w-full object-cover object-top transition-[object-position,transform,opacity] duration-[1200ms] ease-out ${
                loaded ? 'opacity-100' : 'opacity-0'
              } ${mediaMotion}`}
            />
          )}
        </div>

        <h3 className="mt-4 font-hn text-sm font-medium uppercase tracking-[0.08em] text-white">
          {project.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 font-hn text-xs leading-relaxed text-white/50">
          {project.description}
        </p>

        {chips.length > 0 && (
          <ul className="mt-3 flex list-none flex-wrap gap-1.5 p-0">
            {chips.map(tech => (
              <TechChip key={tech} label={tech} />
            ))}
          </ul>
        )}
      </button>

      {/* Footer: status / type on the left, live link on the right. */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
        <span className="font-hn text-[9px] uppercase tracking-[0.2em] text-white/35">
          {statusLabels[project.status]}
          <span className="px-1.5 text-white/20">·</span>
          {typeLabels[project.type]}
        </span>

        {hasUrl ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-hn text-[9px] uppercase tracking-[0.2em] text-white/50 transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            VISIT →
          </a>
        ) : project.status === 'private' ? (
          <span className="font-hn text-[9px] uppercase tracking-[0.2em] text-white/25">
            PRIVATE / NDA
          </span>
        ) : null}
      </div>
    </article>
  )
}
