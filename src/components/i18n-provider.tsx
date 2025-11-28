"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Dictionary, en, th } from '@/lib/dictionaries'

type Language = 'en' | 'th'

interface I18nContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
    dict: Dictionary
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('th')

    // Load language from localStorage on mount
    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang && (savedLang === 'en' || savedLang === 'th')) {
            setLanguage(savedLang)
        }
    }, [])

    // Save language to localStorage when changed
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('language', lang)
    }

    const dict = language === 'th' ? th : en

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: any = dict

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k]
            } else {
                return key // Return key if translation not found
            }
        }

        return typeof value === 'string' ? value : key
    }

    return (
        <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dict }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider')
    }
    return context
}
