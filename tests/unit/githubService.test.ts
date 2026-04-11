import { beforeEach, describe, expect, it, vi } from 'vitest'
import { translations } from '@/app/constants/translations'
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

    it('fetchAllPages trata status desconhecido com mensagem de página', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 418, statusText: "I'm a teapot" })),
        )

        await expect(service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en'))
            .rejects
            .toThrow('Error fetching data on page 1: 418 - I\'m a teapot')
    })

    it('fetchAllPages aplica limite máximo de páginas e emite warning', async () => {
        const oneHundredUsers = Array.from({ length: 100 }, (_, index) => ({ login: `user-${index + 1}` }))
        const fetchMock = vi.fn()

        for (let index = 0; index < 50; index++) {
            fetchMock.mockResolvedValueOnce(
                createMockResponse({ ok: true, status: 200, statusText: 'OK', jsonData: oneHundredUsers }),
            )
        }

        vi.stubGlobal('fetch', fetchMock)

        const result = await service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en')

        expect(result).toHaveLength(5000)
        expect(fetchMock).toHaveBeenCalledTimes(50)
        expect(console.warn).toHaveBeenCalledWith('Reached maximum page limit of 50. Results may be incomplete.')
    })

    it('fetchAllPages trata erro genérico quando exceção não é Error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue('network-down'))

        await expect(service.fetchAllPages('https://api.github.com/users/test/followers', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to fetch data from multiple pages.')
    })

    it('fetchNonFollowers retorna apenas quem não segue de volta', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(
                createMockResponse({
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    jsonData: [{ login: 'alice' }, { login: 'bob' }, { login: 'carol' }],
                }),
            )
            .mockResolvedValueOnce(
                createMockResponse({
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    jsonData: [{ login: 'alice' }, { login: 'carol' }],
                }),
            )

        vi.stubGlobal('fetch', fetchMock)

        const result = await service.fetchNonFollowers('test-user', 'token-123', 'en')

        expect(result).toEqual([{ login: 'bob' }])
    })

    it('fetchNonFollowing retorna apenas quem eu não sigo', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(
                createMockResponse({
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    jsonData: [{ login: 'alice' }, { login: 'bob' }, { login: 'carol' }],
                }),
            )
            .mockResolvedValueOnce(
                createMockResponse({
                    ok: true,
                    status: 200,
                    statusText: 'OK',
                    jsonData: [{ login: 'alice' }, { login: 'carol' }],
                }),
            )

        vi.stubGlobal('fetch', fetchMock)

        const result = await service.fetchNonFollowing('test-user', 'token-123', 'en')

        expect(result).toEqual([{ login: 'bob' }])
    })

    it('fetchNonFollowers trata erro quando fetchAllPages lança Error', async () => {
        vi.spyOn(service, 'fetchAllPages').mockRejectedValue(new Error('boom'))

        await expect(service.fetchNonFollowers('test-user', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to fetch non-followers: boom')
    })

    it('fetchNonFollowers trata erro genérico quando fetchAllPages lança valor não-Error', async () => {
        vi.spyOn(service, 'fetchAllPages').mockRejectedValue('boom')

        await expect(service.fetchNonFollowers('test-user', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to fetch non-followers.')
    })

    it('fetchNonFollowing trata erro quando fetchAllPages lança Error', async () => {
        vi.spyOn(service, 'fetchAllPages').mockRejectedValue(new Error('boom'))

        await expect(service.fetchNonFollowing('test-user', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to fetch non-following: boom')
    })

    it('fetchNonFollowing trata erro genérico quando fetchAllPages lança valor não-Error', async () => {
        vi.spyOn(service, 'fetchAllPages').mockRejectedValue('boom')

        await expect(service.fetchNonFollowing('test-user', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to fetch non-following.')
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

    it('unfollowUser trata erro 404 com mensagem contextual', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 404, statusText: 'Not Found' })),
        )

        await expect(service.unfollowUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to unfollow octocat: Resource not found. Check the URL or identifier.')
    })

    it('unfollowUser trata status desconhecido com mensagem contextual', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 418, statusText: "I'm a teapot" })),
        )

        await expect(service.unfollowUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to unfollow octocat: 418 I\'m a teapot')
    })

    it('unfollowUser usa fallback quando tradução 403 está ausente', async () => {
        const original403 = translations.en.httpErrorMessage[403]
        try {
            translations.en.httpErrorMessage[403] = undefined

            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 403, statusText: 'Forbidden' })),
            )

            await expect(service.unfollowUser('octocat', 'token-123', 'en'))
                .rejects
                .toThrow('Acesso proibido.')
        } finally {
            translations.en.httpErrorMessage[403] = original403
        }
    })

    it('unfollowUser trata erro genérico quando exceção não é Error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue('network-down'))

        await expect(service.unfollowUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to unfollow the user.')
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

    it('followUser trata erro 403 sem rate limit', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(
                createMockResponse({
                    ok: false,
                    status: 403,
                    statusText: 'Forbidden',
                    jsonData: { message: 'forbidden by policy' },
                }),
            ),
        )

        await expect(service.followUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to follow octocat: Access denied (403).')
    })

    it('followUser usa fallback quando tradução 403 está ausente', async () => {
        const original403 = translations.en.httpErrorMessage[403]
        try {
            translations.en.httpErrorMessage[403] = undefined

            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue(
                    createMockResponse({
                        ok: false,
                        status: 403,
                        statusText: 'Forbidden',
                        jsonData: { message: 'forbidden by policy' },
                    }),
                ),
            )

            await expect(service.followUser('octocat', 'token-123', 'en'))
                .rejects
                .toThrow('Acesso proibido.')
        } finally {
            translations.en.httpErrorMessage[403] = original403
        }
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

    it('followUser usa fallback quando tradução 404 está ausente', async () => {
        const original404 = translations.en.httpErrorMessage[404]
        try {
            translations.en.httpErrorMessage[404] = undefined

            vi.stubGlobal(
                'fetch',
                vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 404, statusText: 'Not Found' })),
            )

            await expect(service.followUser('octocat', 'token-123', 'en'))
                .rejects
                .toThrow('Failed to follow octocat: Usuário não encontrado.')
        } finally {
            translations.en.httpErrorMessage[404] = original404
        }
    })

    it('followUser retorna false para status desconhecido', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 418, statusText: "I'm a teapot" })),
        )

        await expect(service.followUser('octocat', 'token-123', 'en')).resolves.toBe(false)
    })

    it('followUser trata erro 500 com mensagem contextual', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue(createMockResponse({ ok: false, status: 500, statusText: 'Internal Server Error' })),
        )

        await expect(service.followUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to follow octocat: Internal server error. Please try again later.')
    })

    it('followUser trata erro genérico quando exceção não é Error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue('network-down'))

        await expect(service.followUser('octocat', 'token-123', 'en'))
            .rejects
            .toThrow('Failed to follow the user.')
    })
})