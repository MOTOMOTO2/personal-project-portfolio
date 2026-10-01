import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element in index.html')

createRoot(container).render(
  <StrictMode>
    {/* basename tracks Vite's `base`, so the same build works at a domain root
        or under a GitHub Pages /<repo>/ subpath. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
