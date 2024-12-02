import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SessionProvider } from './context/SessionContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider>
      <AuthProvider>
    <BrowserRouter>
        <App/>
    </BrowserRouter>
    </AuthProvider>
    </SessionProvider>
  </StrictMode>,
)
