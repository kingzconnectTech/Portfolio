import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { HomePage } from './pages/HomePage'
import { StoryPage } from './pages/StoryPage'
import { MessagePage } from './pages/MessagePage'
import { JobsPage } from './pages/JobsPage'
import { SkillsPage } from './pages/SkillsPage'
import { NotFoundPage } from './pages/NotFoundPage'

/**
 * Keyed by pathname so a page that throws is discarded as soon as the user
 * navigates elsewhere, rather than leaving the fallback stuck on screen.
 */
function AppRoutes() {
  const location = useLocation()

  return (
    <ErrorBoundary key={location.pathname} label={`route:${location.pathname}`}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
