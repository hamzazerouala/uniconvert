import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import i18n from './i18n'
import './index.css'
import './i18n'

const setLangDirAndTitle = () => {
  const lang = i18n.language || 'en'
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  document.title = i18n.t('header.title')
}

setLangDirAndTitle()
i18n.on('languageChanged', () => setLangDirAndTitle())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
