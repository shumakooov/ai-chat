import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ChatWindow from './pages/ChatWindow.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatWindow />
  </StrictMode>,
)
