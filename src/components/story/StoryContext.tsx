import { createContext, useContext } from 'react'
import type { Project } from '../../data/projects'

export type StoryProgressContextValue = {
  progress: number
  isMobile: boolean
  reducedMotion: boolean
  onSelectProject: (project: Project) => void
  onExit: () => void
  onGoProjects: () => void
  scrollToChapter: (chapterId: string) => void
}

export const StoryProgressContext = createContext<StoryProgressContextValue | null>(null)

export function useStoryProgress() {
  const ctx = useContext(StoryProgressContext)
  if (!ctx) throw new Error('useStoryProgress must be used within StoryExperience')
  return ctx
}
