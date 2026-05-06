'use client'

import { useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Props = {
    id: string
    currentStatus: string
}

export function LeadStatusSelect({ id, currentStatus }: Props) {
    const supabase = createClient()
    const [isPending, startTransition] = useTransition()

    async function updateStatus(status: string) {
        startTransition(async () => {
            await supabase
                .from('leads')
                .update({ status })
                .eq('id', id)
        })
    }

    const items = [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "closed" },
    ]

    return <Select defaultValue={currentStatus} onValueChange={(value) => updateStatus(value)} disabled={isPending}>
        <SelectTrigger className="">
            <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                {items.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                        {item.label}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>

}
