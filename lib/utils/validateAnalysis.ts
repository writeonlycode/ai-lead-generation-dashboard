export function validateAnalysis(data: any) {
    if (
        typeof data.score !== 'number' ||
        !['cold', 'warm', 'hot'].includes(data.label)
    ) {
        throw new Error('Invalid AI response')
    }

    return data
}
