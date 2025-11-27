'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { submitReport } from "./actions"
import { useToast } from "@/hooks/use-toast" // Assuming shadcn toast is installed or will be
import { Loader2 } from "lucide-react"

// Schema matching the server action validation
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    incidentType: z.string().min(1, "Incident Type is required"),
    province: z.string().min(1, "Province is required"),
    district: z.string().min(1, "District is required"),
    subdistrict: z.string().min(1, "Subdistrict is required"),
    address: z.string().optional(),
    reporterName: z.string().min(1, "Name is required"),
    reporterPhone: z.string().min(1, "Phone is required"),
})

export default function ReportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successId, setSuccessId] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            incidentType: "",
            province: "Nakhon Ratchasima",
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
            alert(result.message) // Simple alert for now
        }
    }

    if (successId) {
        return (
            <div className="container mx-auto py-10 px-4 flex justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-green-600">Report Submitted!</CardTitle>
                        <CardDescription>Your incident has been recorded.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Tracking ID:</p>
                        <div className="bg-slate-100 p-4 rounded-lg font-mono text-xl font-bold mb-6">
                            {successId}
                        </div>
                        <Button onClick={() => window.location.href = "/"}>Return Home</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Report New Incident</CardTitle>
                    <CardDescription>Please provide details about the disaster situation.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic / Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Flood at Village 5" {...field} />
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
                                        <FormLabel>Incident Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FLOOD">Flood</SelectItem>
                                                <SelectItem value="LANDSLIDE">Landslide</SelectItem>
                                                <SelectItem value="FIRE">Fire</SelectItem>
                                                <SelectItem value="STORM">Storm</SelectItem>
                                                <SelectItem value="OTHER">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Province</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="district"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>District</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Muang" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="subdistrict"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subdistrict</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Nai Muang" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Specific Address / Landmark</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Near Wat Salaloi..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe the situation..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="reporterName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
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
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="081xxxxxxx" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit Report
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
