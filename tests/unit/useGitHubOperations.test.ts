// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useGitHubOperations } from '@/app/hooks/useGitHubOperations'
import { GitHubService } from '@/app/interfaces/GitHubService'
import { User } from '@/app/interfaces/User'

const user = (login: string): User => ({ login, avatar_url: `https://avatars.githubusercontent.com/${login}` })

const createServiceMock = (): GitHubService => ({
    fetchAllPages: vi.fn(),
    fetchNonFollowers: vi.fn(),
    fetchNonFollowing: vi.fn(),
    unfollowUser: vi.fn(),
    followUser: vi.fn(),
})

describe('useGitHubOperations', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
        vi.spyOn(console, 'error').mockImplementation(() => undefined)
    })

    it('bloqueia busca quando faltam credenciais', async () => {
        const service = createServiceMock()
        const { result } = renderHook(() => useGitHubOperations(service))

        await expect(result.current.handleSearchNonFollowers('', '', 'en')).rejects.toThrow(
            'Please enter your GitHub username and API key.',
        )
    })

    it('popula listas ao buscar não seguidores e não seguidos', async () => {
        const service = createServiceMock()
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([user('alice')])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([user('bob')])

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
        })

        expect(result.current.nonFollowers).toEqual([user('alice')])
        expect(result.current.nonFollowing).toEqual([user('bob')])
        expect(result.current.isSearching).toBe(false)
    })

    it('atualiza estado ao deixar de seguir usuário com sucesso', async () => {
        const service = createServiceMock()
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([user('alice')])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([])
        vi.mocked(service.unfollowUser).mockResolvedValue(true)

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
            await result.current.handleUnfollow('alice', 'token-123', 'en')
        })

        expect(result.current.nonFollowers).toEqual([])
        expect(result.current.unfollowedUsers).toEqual(['alice'])
    })

    it('atualiza estado ao seguir usuário com sucesso', async () => {
        const service = createServiceMock()
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([user('bob')])
        vi.mocked(service.followUser).mockResolvedValue(true)

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
            await result.current.handleFollow('bob', 'token-123', 'en')
        })

        expect(result.current.nonFollowing).toEqual([])
        expect(result.current.followingUsers).toEqual(['bob'])
    })

    it('executa unfollow em lote respeitando todos os usuários carregados', async () => {
        const service = createServiceMock()
        const users = Array.from({ length: 7 }, (_, index) => user(`u${index + 1}`))
        vi.mocked(service.fetchNonFollowers).mockResolvedValue(users)
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([])
        vi.mocked(service.unfollowUser).mockResolvedValue(true)

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
        })

        await waitFor(() => {
            expect(result.current.nonFollowers).toHaveLength(7)
        })

        await act(async () => {
            await result.current.handleUnfollowAll('token-123', 'en')
        })

        expect(service.unfollowUser).toHaveBeenCalledTimes(7)
        await waitFor(() => {
            expect(result.current.isSearching).toBe(false)
        })
    })

    it('executa follow em lote respeitando todos os usuários carregados', async () => {
        const service = createServiceMock()
        const users = Array.from({ length: 7 }, (_, index) => user(`f${index + 1}`))
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue(users)
        vi.mocked(service.followUser).mockResolvedValue(true)

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
        })

        await waitFor(() => {
            expect(result.current.nonFollowing).toHaveLength(7)
        })

        await act(async () => {
            await result.current.handleFollowAll('token-123', 'en')
        })

        expect(service.followUser).toHaveBeenCalledTimes(7)
    })

    it('retorna erro genérico ao receber exceção não-Error em unfollow', async () => {
        const service = createServiceMock()
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([user('alice')])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([])
        vi.mocked(service.unfollowUser).mockRejectedValue('unexpected')

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
        })

        await expect(result.current.handleUnfollow('alice', 'token-123', 'en')).rejects.toThrow(
            'Failed to unfollow the user.',
        )
    })

    it('propaga erro existente ao receber Error em unfollow', async () => {
        const service = createServiceMock()
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([user('alice')])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([])
        vi.mocked(service.unfollowUser).mockRejectedValue(new Error('api exploded'))

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
        })

        await expect(result.current.handleUnfollow('alice', 'token-123', 'en')).rejects.toThrow('api exploded')
    })

    it('retorna erro genérico ao receber exceção não-Error em follow', async () => {
        const service = createServiceMock()
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([user('bob')])
        vi.mocked(service.followUser).mockRejectedValue('unexpected')

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
        })

        await expect(result.current.handleFollow('bob', 'token-123', 'en')).rejects.toThrow(
            'Failed to follow the user.',
        )
    })

    it('propaga erro existente ao receber Error em follow', async () => {
        const service = createServiceMock()
        vi.mocked(service.fetchNonFollowers).mockResolvedValue([])
        vi.mocked(service.fetchNonFollowing).mockResolvedValue([user('bob')])
        vi.mocked(service.followUser).mockRejectedValue(new Error('api exploded'))

        const { result } = renderHook(() => useGitHubOperations(service))

        await act(async () => {
            await result.current.handleSearchNonFollowers('octocat', 'token-123', 'en')
        })

        await expect(result.current.handleFollow('bob', 'token-123', 'en')).rejects.toThrow('api exploded')
    })
})
