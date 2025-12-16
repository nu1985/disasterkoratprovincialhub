'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useI18n } from "@/components/i18n-provider"

export default function SettingsPage() {
    const { t } = useI18n()

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{t('dashboard.menu.settings')}</h2>

            <Card>
                <CardHeader>
                    <CardTitle>{t('settings.header')}</CardTitle>
                    <CardDescription>{t('settings.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>{t('settings.language')}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t('settings.languageDescription')}
                            </p>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
