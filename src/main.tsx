import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { ManageProvider } from './context/ManagePropertyContext.tsx'
import { PropertyProvider } from './context/AddPropertyContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PropertyProvider>
          <ManageProvider>
            <App />
          </ManageProvider>
        </PropertyProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)