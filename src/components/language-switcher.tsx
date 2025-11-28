"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useI18n } from "./i18n-provider"

export function LanguageSwitcher() {
    const { language, setLanguage } = useI18n()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('th')} className={language === 'th' ? 'bg-accent' : ''}>
                    🇹🇭 Thai (ไทย)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-accent' : ''}>
                    🇬🇧 English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
