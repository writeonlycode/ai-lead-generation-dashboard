import { createClient } from '@/lib/supabase/server'
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item"

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return <div>Unauthorized</div>
    }

    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div>Error loading leads</div>
    }

    return (
        <div className='py-6 grow flex-col justify-center flex w-full max-w-prose mx-auto'>
            <h1 className="text-xl font-semibold text-center mb-4">Leads</h1>

            <div className="space-y-2">
                {leads?.map((lead) => (
                    <Item asChild variant="outline" key={lead.id}>
                        <Link href={`/dashboard/${lead.id}`}>
                            <ItemContent>
                                <ItemTitle>{lead.name}</ItemTitle>
                                <ItemDescription>
                                    {lead.message}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <ChevronRightIcon className="size-4" />
                            </ItemActions>
                        </Link>
                    </Item>
                ))}
            </div>
        </div>
    )
}
