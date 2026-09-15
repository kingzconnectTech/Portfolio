import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { StoryPage } from './pages/StoryPage'
import { MessagePage } from './pages/MessagePage'
import { JobsPage } from './pages/JobsPage'
import { SkillsPage } from './pages/SkillsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/story" element={<StoryPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
      </Routes>
    </Router>
  )
}

export default App
