import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// React uygulamasının ana giriş noktası
createRoot(document.getElementById('root')).render(
  // Geliştirme modunda potansiyel sorunları tespit etmek için StrictMode kullanılır
  <StrictMode>
    <App />
  </StrictMode>,
)
