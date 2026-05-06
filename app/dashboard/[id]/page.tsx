import { createClient } from '@/lib/supabase/server'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { LeadStatusSelect } from '@/components/leads/lead-status-select';

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

    const date = new Date(lead.created_at)


    const { data: leadAnalysis, error: leadAnalysisError } = await supabase
        .from('lead_analysis')
        .select('*')
        .eq('lead_id', id)
        .single()

    return (
        <div className='py-6 grow flex-col justify-center flex'>
            <Card className="mx-auto w-full max-w-prose">
                <CardHeader>
                    <CardTitle>{lead.name}</CardTitle>
                    <CardDescription>
                        <div>
                            {lead.email}
                        </div>
                        <div>
                            {date.toLocaleString()}
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <div>
                        <div className='leading-none font-semibold'>
                            Message
                        </div>
                        <div className='text-sm text-muted-foreground'>
                            {lead.message}
                        </div>
                    </div>
                    {leadAnalysis &&
                        <div className='border rounded p-4 flex flex-col gap-4'>
                            <h2 className='text-lg leading-none font-bold'>
                                AI Summary
                            </h2>
                            <div>
                                <div className='leading-none font-semibold'>
                                    Score
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {leadAnalysis.score}
                                </div>
                            </div>
                            <div>
                                <div className='leading-none font-semibold'>
                                    Label
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {leadAnalysis.label}
                                </div>
                            </div>
                            <div>
                                <div className='leading-none font-semibold'>
                                    Intent Summary
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {leadAnalysis.intent_summary}
                                </div>
                            </div>
                            <div>
                                <div className='leading-none font-semibold'>
                                    Suggested Action
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    {leadAnalysis.suggested_action}
                                </div>
                            </div>
                        </div>
                    }
                    <LeadStatusSelect id={lead.id} currentStatus={lead.status} />
                </CardContent>
                <CardFooter className="flex gap-2">

                </CardFooter>
            </Card>
        </div>
    )
}
