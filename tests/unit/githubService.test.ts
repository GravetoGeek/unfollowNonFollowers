import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GitHubServiceImpl } from '@/app/services/GitHubService'

type MockResponseOptions = {
    ok: boolean
    status: number
    statusText: string
    jsonData?: unknown
}

const createMockResponse = ({ ok, status, statusText, jsonData = [] }: MockResponseOptions): Response => {
    return {
        ok,
        status,
        statusText,
        json: vi.fn().mockResolvedValue(jsonData),
    } as unknown as Response
}

describe('GitHubServiceImpl', () => {
    const service = new GitHubServiceImpl()

    beforeEach(() => {
        vi.restoreAllMocks()
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
        vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    it('fetchAllPages retorna dados paginados em caso 200', async () => {
        const firstPage = Array.from({ length: 100 }, (_, index) => ({ login: `user-${index + 1}` }))
        const secondPage = [{ login: 'user-101' }, { login: 'user-102' }]

        const fetchMock = vi.fn()
            .mockResolvedValueOnce(createMockResponse({ ok: true, status: 200, statusText: 'OK', jsonData: firstPage }))
            .mockResolvedValueOnce(createMockResponse({ ok: true, status: 200, statusText: 'OK', jsonData: secondPage }))

        vi.stubGlobal('fetch', fetchMock)

        const result = await service.fetchAllPages<{ login: string }>('https://api.github.com/users/test/followers', 'token-123', 'en')

        expect(result).toHaveLength(102)
        expect(fetchMock).toHaveBeenCalledTimes(2)
        expect(fetchMock).toHaveBeenNthCalledWith(
            1,
            'https://api.github.com/users/test/followers?per_page=100&page=1',
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'token token-123' }),
            }),
        )
    })

    it('fetchAllPages trata erro 401', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 401, statusText: 'Unauthorized' })),
        )

        await expect(service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to fetch data from multiple pages:')

        await expect(service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en'))
            .rejects
            .toThrow('Personal Access Tokens')
    })

    it('fetchAllPages trata erro 403', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 403, statusText: 'Forbidden' })),
        )

        await expect(service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en'))
            .rejects
            .toThrow('Access denied (403).')
    })

    it('fetchAllPages trata erro 404', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 404, statusText: 'Not Found' })),
        )

        await expect(service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en'))
            .rejects
            .toThrow('Resource not found. Check the URL or identifier.')
    })

    it('fetchAllPages trata erro 500', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 500, statusText: 'Internal Server Error' })),
        )

        await expect(service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en'))
            .rejects
            .toThrow('Internal server error. Please try again later.')
    })

    it('unfollowUser retorna true em sucesso', async () => {
        const fetchMock = vi.fn().mockResolvedValue(createMockResponse({ ok: true, status: 204, statusText: 'No Content' }))
        vi.stubGlobal('fetch', fetchMock)

        const result = await service.unfollowUser('octocat', 'token-123', 'en')

        expect(result).toBe(true)
        expect(fetchMock).toHaveBeenCalledWith(
            'https://api.github.com/user/following/octocat',
            expect.objectContaining({
                method: 'DELETE',
                headers: expect.objectContaining({ Authorization: 'token token-123' }),
            }),
        )
    })

    it('unfollowUser trata erro 401', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 401, statusText: 'Unauthorized' })),
        )

        await expect(service.unfollowUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Personal Access Tokens')
    })

    it('unfollowUser trata erro 403 com mensagem contextual', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 403, statusText: 'Forbidden' })),
        )

        await expect(service.unfollowUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to unfollow octocat: Access denied (403).')
    })

    it('followUser retorna true em sucesso', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: true, status: 204, statusText: 'No Content' })),
        )

        await expect(service.followUser('octocat', 'token-123', 'en')).resolves.toBe(true)
    })

    it('followUser trata erro 401', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 401, statusText: 'Unauthorized' })),
        )

        await expect(service.followUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Personal Access Tokens')
    })

    it('followUser trata rate limit em 403', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                createMockResponse({
                    ok: false,
                    status: 403,
                    statusText: 'Forbidden',
                    jsonData: { message: 'You have triggered an abuse detection mechanism' },
                }),
            ),
        )

        await expect(service.followUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to follow octocat: Rate Limit (403): You have triggered an abuse detection mechanism')
    })

    it('followUser trata erro 404 com mensagem contextual', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 404, statusText: 'Not Found' })),
        )

        await expect(service.followUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to follow octocat: Resource not found. Check the URL or identifier.')
    })

    it('followUser retorna false para status desconhecido', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 418, statusText: "I'm a teapot" })),
        )

        await expect(service.followUser('octocat', 'token-123', 'en')).resolves.toBe(false)
    })
})