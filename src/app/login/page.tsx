'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useI18n } from '@/components/i18n-provider'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function LoginPage() {
    const router = useRouter()
    const { t } = useI18n()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError(t('login.invalidCredentials'))
                setIsLoading(false)
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            setError(t('common.error'))
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">{t('login.title')}</CardTitle>
                    <CardDescription className="text-center">
                        {t('login.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>{t('common.error')}</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="username">{t('login.username')}</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="admin"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('login.password')}</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t('login.signingIn')}
                                </>
                            ) : (
                                t('login.signIn')
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" className="text-sm text-slate-500" onClick={() => router.push('/')}>
                        {t('common.backToHome')}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
