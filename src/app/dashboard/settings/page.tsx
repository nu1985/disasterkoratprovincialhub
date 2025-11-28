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
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage your application preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Language</Label>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred language for the interface.
                            </p>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
