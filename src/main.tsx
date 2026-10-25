import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary, reportError } from './components/ErrorBoundary'
import './index.css'

// Failures thrown outside React's render cycle — event handlers, async work,
// module evaluation — never reach an error boundary, so they are captured here.
// Without this the only production symptom is a frozen or blank page.
window.addEventListener('error', (event) => {
  reportError(event.error ?? event.message, { source: 'window.error' })
})

window.addEventListener('unhandledrejection', (event) => {
  reportError(event.reason, { source: 'window.unhandledrejection' })
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary label="app">
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
