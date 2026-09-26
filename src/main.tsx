import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/great-vibes/latin-400.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/cinzel/latin-500.css'
import '@fontsource/cinzel/latin-600.css'
import './styles/base.css'
import './styles/invitation.css'
import InvitationPage from './pages/InvitationPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InvitationPage />
  </StrictMode>,
)
