import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { analyzeAndStoreLead } from '@/lib/ai/openai'

export async function POST(req: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Parse body
        const body = await req.json()
        const { name, email, message } = body

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Insert lead
        const { data, error } = await supabase
            .from('leads')
            .insert({
                name,
                email,
                message,
            })
            .select()
            .single()

        if (error) {
            console.error('Insert error:', error)

            return NextResponse.json(
                { error: 'Failed to create lead' },
                { status: 500 }
            )
        }

        // Fire-and-forget AI (do NOT await)
        analyzeAndStoreLead(data)

        // Success
        return NextResponse.json(
            { data },
            { status: 201 }
        )

    } catch (err) {
        console.error('Unexpected error:', err)

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
