import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import KillerSelection from './KillerSelection.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import Menu from './Menu.tsx'
import History from './History.tsx'
import PerkSelection from './PerkSelection.tsx'
import Market from './Market.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/killerSelection" element={<KillerSelection />} />
        <Route path="/perkSelection" element={<PerkSelection />} />
        <Route path="/history" element={<History />} />
        <Route path="/market" element={<Market />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
