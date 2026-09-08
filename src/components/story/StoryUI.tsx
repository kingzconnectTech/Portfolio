import type { Project } from '../../data/projects'
import {
  getChapterAtProgress,
  storyMeta,
  storyNavChapters,
  storyProjects,
} from '../../data/story'
import { useStoryProgress } from './StoryContext'
import { smoothstep } from './math'

type Props = {
  entered: boolean
  selectedProject: Project | null
  onCloseProject: () => void
}

export function StoryUI({ entered, selectedProject, onCloseProject }: Props) {
  const { progress, onExit, onGoProjects, scrollToChapter, onSelectProject } = useStoryProgress()
  const chapter = getChapterAtProgress(progress)
  const showIntro = progress < 0.055
  const showChapterCopy = progress >= 0.055 && progress < 0.9
  const showFinale = progress >= 0.9
  const introOpacity = 1 - smoothstep(0.02, 0.07, progress)
  const chapterOpacity =
    chapter.id === 'intro' ? 0 : smoothstep(chapter.range[0], chapter.range[0] + 0.02, progress) *
      (1 - smoothstep(chapter.range[1] - 0.015, chapter.range[1], progress))

  const displayIndex = Math.max(
    1,
    storyNavChapters.findIndex((c) => c.id === chapter.id) + 1,
  )
  const total = storyNavChapters.length

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 text-cream transition-opacity duration-700 ${
        entered ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Top chrome */}
      <div className="pointer-events-auto absolute inset-x-0 top-0 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7">
        <button
          type="button"
          onClick={onExit}
          className="font-hn text-[11px] tracking-[0.22em] text-cream/80 transition-opacity hover:opacity-60 sm:text-xs"
        >
          ← BACK
        </button>
        <div className="text-right">
          <div className="font-hn text-[11px] tracking-[0.28em] text-cream/50 sm:text-xs">KINGZCONNECT</div>
          <div className="mt-1 font-hn text-[11px] tracking-[0.2em] text-cream sm:text-xs">STORY</div>
        </div>
      </div>

      {/* Vertical chapter rail */}
      <nav className="pointer-events-auto absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-2 sm:right-7 sm:flex">
        {storyNavChapters.map((c) => {
          const active = c.id === chapter.id || (chapter.id === 'intro' && c.number === '01' && progress > 0.04)
          const reached = progress >= c.range[0]
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => scrollToChapter(c.id)}
              className={`font-hn text-[10px] tracking-[0.18em] transition-all duration-300 ${
                active ? 'text-cream scale-110' : reached ? 'text-cream/40 hover:text-cream/70' : 'text-cream/20 hover:text-cream/45'
              }`}
              aria-label={`Chapter ${c.number} ${c.title}`}
            >
              {c.number}
            </button>
          )
        })}
      </nav>

      {/* Intro title */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ opacity: showIntro ? introOpacity : 0, transition: 'opacity 0.4s ease' }}
      >
        <h1 className="font-hn text-[11vw] leading-[0.92] tracking-[-0.03em] sm:text-[5.5vw] whitespace-pre-line">
          {storyMeta.title}
        </h1>
        <p className="mt-6 max-w-md font-hn text-sm text-cream/55 sm:text-base">{storyMeta.subtitle}</p>
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2">
          <span className="font-hn text-[10px] tracking-[0.28em] text-cream/45 sm:text-[11px]">
            {storyMeta.scrollHint}
          </span>
          <span className="story-scroll-hint text-cream/40">↓</span>
        </div>
      </div>

      {/* Chapter copy */}
      {showChapterCopy && chapter.id !== 'intro' && (
        <div
          className="absolute left-5 top-[22%] max-w-[16rem] sm:left-10 sm:max-w-xs lg:left-14"
          style={{ opacity: chapterOpacity }}
        >
          <div className="font-hn text-[11px] tracking-[0.28em] text-amber-story/80 sm:text-xs" style={{ color: '#c4a574' }}>
            {chapter.number}
          </div>
          <h2 className="mt-2 font-hn text-2xl tracking-[-0.02em] sm:text-3xl">{chapter.title}</h2>
          <div className="mt-5 space-y-2">
            {chapter.lines.map((line) => (
              <p
                key={line}
                className={`font-hn text-sm leading-relaxed sm:text-[15px] ${
                  line === 'solve it.' ? 'text-cream mt-3 tracking-[0.04em]' : 'text-cream/60'
                }`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Chapter 08 — HTML project hits for reliable selection */}
      {chapter.id === 'building' && (
        <div
          className="pointer-events-auto absolute bottom-24 left-5 right-5 flex gap-2 overflow-x-auto pb-1 sm:bottom-28 sm:left-10 sm:right-auto sm:max-w-xl"
          style={{ opacity: chapterOpacity }}
        >
          {storyProjects.slice(0, 4).map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project)}
              className="min-w-[9.5rem] shrink-0 border border-cream/15 bg-black/40 px-3 py-3 text-left backdrop-blur-sm transition-colors hover:border-cream/40"
            >
              <div className="font-hn text-[9px] tracking-[0.16em]" style={{ color: '#c4a574' }}>
                {project.category}
              </div>
              <div className="mt-1 font-hn text-xs text-cream">{project.name}</div>
            </button>
          ))}
        </div>
      )}

      {/* Enhanced Finale */}
      <div
        className="absolute inset-x-0 bottom-[18%] flex flex-col items-center px-6 text-center"
        style={{
          opacity: showFinale ? smoothstep(0.9, 0.96, progress) : 0,
          pointerEvents: showFinale ? 'auto' : 'none',
        }}
      >
        <div className="font-hn text-[11px] tracking-[0.28em]" style={{ color: '#c4a574' }}>
          10
        </div>
        <h2 className="mt-2 font-hn text-3xl tracking-[-0.02em] sm:text-4xl">TODAY</h2>
        <div className="mt-5 space-y-1 font-hn text-sm text-cream/65 sm:text-base">
          {storyMeta.final.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <p className="mt-8 font-hn text-sm tracking-[0.22em] sm:text-base">{storyMeta.final.brand}</p>
        <div className="mt-6 space-y-1 font-hn text-xs text-cream/50 sm:text-sm">
          {storyMeta.final.statement.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
        <button
          type="button"
          onClick={onExit}
          className="pointer-events-auto mt-8 border border-cream/30 px-6 py-3 font-hn text-[11px] tracking-[0.22em] text-cream transition-colors hover:border-cream hover:bg-cream/5"
        >
          BACK TO HOME
        </button>
      </div>

      {/* Bottom progress */}
      <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-7">
        <div className="mb-2 flex items-center justify-between font-hn text-[10px] tracking-[0.2em] text-cream/45 sm:text-[11px]">
          <span>
            {String(Math.min(displayIndex, total)).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button
            type="button"
            onClick={onExit}
            className="pointer-events-auto text-cream/55 transition-opacity hover:opacity-100"
          >
            BACK TO HOME
          </button>
        </div>
        <div className="h-px w-full bg-cream/15">
          <div className="h-px bg-cream/70 transition-[width] duration-150 ease-out" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Project detail sheet */}
      {selectedProject && (
        <div className="pointer-events-auto absolute inset-0 z-20 flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md border border-cream/15 bg-[#141210] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-hn text-[10px] tracking-[0.2em]" style={{ color: '#c4a574' }}>
                  {selectedProject.category}
                </div>
                <h3 className="mt-2 font-hn text-2xl">{selectedProject.name}</h3>
              </div>
              <button type="button" onClick={onCloseProject} className="font-hn text-xs text-cream/60 hover:text-cream">
                CLOSE
              </button>
            </div>
            <p className="mt-4 font-hn text-sm leading-relaxed text-cream/60">{selectedProject.description}</p>
            <div className="mt-5">
              <div className="font-hn text-[10px] tracking-[0.16em] text-cream/40">ROLE</div>
              <div className="mt-1 font-hn text-sm">{selectedProject.role}</div>
            </div>
            <div className="mt-4">
              <div className="font-hn text-[10px] tracking-[0.16em] text-cream/40">TECHNOLOGIES</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span key={tech} className="border border-cream/15 px-2 py-1 font-hn text-[10px] tracking-[0.08em] text-cream/70">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            {selectedProject.link && (
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block font-hn text-[11px] tracking-[0.18em] text-cream underline-offset-4 hover:underline"
              >
                OPEN PROJECT →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
