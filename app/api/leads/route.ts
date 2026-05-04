import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

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

    if (error) {
      console.error('Insert error:', error)

      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      )
    }

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
