export function safeParseJSON(text: string) {
    try {
        // Remove markdown fences if present
        const cleaned = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()

        return JSON.parse(cleaned)
    } catch (e) {
        console.error('JSON parse failed:', e)

        return {
            score: 0,
            label: 'cold',
            intent_summary: 'Failed to analyze lead',
            suggested_action: 'Review manually',
            raw: text,
        }
    }
}
