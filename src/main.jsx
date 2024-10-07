import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SessionProvider } from './context/SessionContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider>
    <BrowserRouter>
      
        <App/>
      
    </BrowserRouter>
    </SessionProvider>
  </StrictMode>,
)
