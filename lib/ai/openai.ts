import OpenAI from "openai";
import createPrompt from '../utils/createPrompt'
import { safeParseJSON } from '../utils/safeParseJSON'
import { createClient } from '@supabase/supabase-js'
import { validateAnalysis } from '../utils/validateAnalysis'

export async function analyzeAndStoreLead({
    id,
    name,
    email,
    message,
}: {
    id: string
    name: string
    email: string
    message: string
}) {
    const prompt = createPrompt(name, email, message)

    const client = new OpenAI();
    const response = await client.responses.create({
        model: "gpt-5.5",
        input: prompt
    });

    const text = response.output_text
    const parsed = safeParseJSON(text)
    const validated = validateAnalysis(parsed)

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    try {
        await supabase.from('lead_analysis').insert({
            lead_id: id,
            score: validated.score,
            label: validated.label,
            intent_summary: validated.intent_summary,
            suggested_action: validated.suggested_action,
            raw_response: text,
            model: 'gpt-5.5',
        })
    } catch (err) {
        console.error('AI processing failed:', err)
    }
}
