export interface StatsData {
    visitors: number
    lastUsers: string[]
}

export interface StatsResponse extends StatsData {
    success: boolean
    error?: string
}

export const DEFAULT_STATS: StatsData = { visitors: 0, lastUsers: [] }

export const toStatsResponse = (
    data: Partial<StatsData> | unknown,
    options?: { success?: boolean; error?: string },
): StatsResponse => {
    const raw = (typeof data === 'object' && data !== null ? data : {}) as Partial<StatsData>

    const safeVisitors = typeof raw.visitors === 'number' && Number.isFinite(raw.visitors)
        ? raw.visitors
        : 0

    const safeLastUsers = Array.isArray(raw.lastUsers)
        ? raw.lastUsers.filter((user): user is string => typeof user === 'string').slice(0, 10)
        : []

    const payload: StatsResponse = {
        success: options?.success ?? true,
        visitors: safeVisitors,
        lastUsers: safeLastUsers,
    }

    if (options?.error) {
        payload.error = options.error
    }

    return payload
}
