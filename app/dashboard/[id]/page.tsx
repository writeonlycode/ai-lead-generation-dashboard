import { createClient } from '@/lib/supabase/server'
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default async function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return <div>Unauthorized</div>
    }

    const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return <div>Error loading lead: {JSON.stringify(error)}</div>
    }

    return (
        <div className='py-6 grow flex-col justify-center flex'>
            <Card className="mx-auto w-full max-w-prose">
                <CardHeader>
                    <CardTitle>{lead.name}</CardTitle>
                    <CardDescription>
                        {lead.email}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {lead.message}
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                        {lead.status}
                    </Badge>
                </CardFooter>
            </Card>
        </div>
    )
}
