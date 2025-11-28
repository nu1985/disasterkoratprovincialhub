'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { submitReport } from "./actions"
import { Loader2 } from "lucide-react"
import { useI18n } from "@/components/i18n-provider"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function ReportPage() {
    const { t } = useI18n()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successId, setSuccessId] = useState<string | null>(null)

    // Schema matching the server action validation
    const formSchema = z.object({
        title: z.string().min(1, t('common.error')), // Simplified validation message for now
        description: z.string().optional(),
        incidentType: z.string().min(1, t('common.error')),
        province: z.string().min(1, t('common.error')),
        district: z.string().min(1, t('common.error')),
        subdistrict: z.string().min(1, t('common.error')),
        address: z.string().optional(),
        reporterName: z.string().min(1, t('common.error')),
        reporterPhone: z.string().min(1, t('common.error')),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            incidentType: "",
            province: "นครราชสีมา",
            district: "",
            subdistrict: "",
            address: "",
            reporterName: "",
            reporterPhone: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        const formData = new FormData()
        Object.entries(values).forEach(([key, value]) => {
            if (value) formData.append(key, value)
        })

        const result = await submitReport(null, formData)
        setIsSubmitting(false)

        if (result.success) {
            setSuccessId(result.incidentId || "UNKNOWN")
        } else {
            alert(result.message)
        }
    }

    if (successId) {
        return (
            <div className="container mx-auto py-10 px-4 flex justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-green-600">{t('report.success.title')}</CardTitle>
                        <CardDescription>{t('report.success.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">{t('report.success.trackingId')}:</p>
                        <div className="bg-slate-100 p-4 rounded-lg font-mono text-xl font-bold mb-6">
                            {successId}
                        </div>
                        <Button onClick={() => window.location.href = "/"}>{t('common.backToHome')}</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4 relative">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{t('report.title')}</CardTitle>
                    <CardDescription>{t('report.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('report.form.topic')}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={t('report.form.topicPlaceholder')} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="incidentType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('report.form.type')}</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder={t('report.form.typePlaceholder')} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FLOOD">{t('report.types.FLOOD')}</SelectItem>
                                                <SelectItem value="FIRE">{t('report.types.FIRE')}</SelectItem>
                                                <SelectItem value="STORM">{t('report.types.STORM')}</SelectItem>
                                                <SelectItem value="DROUGHT">{t('report.types.DROUGHT')}</SelectItem>
                                                <SelectItem value="ACCIDENT">{t('report.types.ACCIDENT')}</SelectItem>
                                                <SelectItem value="OTHER">{t('report.types.OTHER')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reporterName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('report.form.reporterName')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="reporterPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('report.form.reporterPhone')}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? t('report.form.submitting') : t('report.form.submit')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
