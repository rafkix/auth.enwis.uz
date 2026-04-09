import { cache } from 'react'
import type { Locale } from './locales'

const dictionaries = {
  uz: () => import('./messages/uz.json').then(m => m.default),
  en: () => import('./messages/en.json').then(m => m.default),
  ru: () => import('./messages/ru.json').then(m => m.default),
}

async function loadDictionary(locale: Locale) {
  return dictionaries[locale]()
}

// 🔥 cache qo‘shildi (double fetch yo‘q)
export const getDictionary = cache(async (locale: string) => {
  if (!(locale in dictionaries)) {
    console.warn('Invalid locale:', locale)
    return loadDictionary('uz')
  }

  return loadDictionary(locale as Locale)
})

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>