import { DEFAULT_STATS, toStatsResponse } from '@/app/utils/statsContract'

describe('stats contract', () => {
    it('normaliza payload inválido para defaults', () => {
        const result = toStatsResponse(null)

        expect(result.success).toBe(true)
        expect(result.visitors).toBe(0)
        expect(result.lastUsers).toEqual([])
    })

    it('sanitiza visitors e lastUsers', () => {
        const result = toStatsResponse({
            visitors: Number.NaN,
            lastUsers: ['alice', 1, 'bob', null, 'charlie'] as unknown as string[],
        })

        expect(result.visitors).toBe(0)
        expect(result.lastUsers).toEqual(['alice', 'bob', 'charlie'])
    })

    it('mantém apenas 10 usuários no máximo', () => {
        const users = Array.from({ length: 20 }, (_, idx) => `user-${idx}`)
        const result = toStatsResponse({ visitors: 7, lastUsers: users })

        expect(result.visitors).toBe(7)
        expect(result.lastUsers).toHaveLength(10)
        expect(result.lastUsers[0]).toBe('user-0')
        expect(result.lastUsers[9]).toBe('user-9')
    })

    it('permite sinalizar erro mantendo shape seguro', () => {
        const result = toStatsResponse(DEFAULT_STATS, {
            success: false,
            error: 'Failed to load stats',
        })

        expect(result.success).toBe(false)
        expect(result.error).toBe('Failed to load stats')
        expect(result.visitors).toBe(0)
        expect(result.lastUsers).toEqual([])
    })
})
