import { describe, expect, it } from 'vitest'
import { SupportedLanguages, translations } from '@/app/constants/translations'

const languages: SupportedLanguages[] = ['pt', 'en', 'zh', 'hi', 'ar', 'ja']

describe('translations contract', () => {
    it('expõe todos os idiomas esperados', () => {
        expect(Object.keys(translations).sort()).toEqual(languages.sort())
    })

    it.each(languages)('mantém estrutura obrigatória para %s', (language) => {
        const t = translations[language]

        expect(typeof t.githubUsername).toBe('string')
        expect(typeof t.githubApiKey).toBe('string')
        expect(typeof t.rememberToken).toBe('string')
        expect(typeof t.search).toBe('string')
        expect(typeof t.noUsersFound).toBe('string')
        expect(typeof t.totalVisitors).toBe('string')

        expect(Array.isArray(t.httpErrorMessage[401])).toBe(true)
        expect(t.httpErrorMessage[401].length).toBeGreaterThan(0)

        const onePage = t.catchErrorMessage.fetchOnePage({ currentPage: 1, status: 500, statusText: 'Internal Error' })
        const manyPages = t.catchErrorMessage.fetchManyPages({ message: 'network' })
        const truncated = t.paginationTruncatedNotice({ maxPages: 50, maxItems: 5000 })
        const nonFollowers = t.catchErrorMessage.fetchNonFollowers({ message: 'network' })
        const nonFollowing = t.catchErrorMessage.fetchNonFollowing({ message: 'network' })
        const unfollow = t.catchErrorMessage.unfollowUser({ username: 'octocat', message: 'forbidden' })
        const follow = t.catchErrorMessage.followUser({ username: 'octocat', message: 'forbidden' })

        expect(onePage).toContain('1')
        expect(manyPages.length).toBeGreaterThan(0)
        expect(truncated.length).toBeGreaterThan(0)
        expect(nonFollowers.length).toBeGreaterThan(0)
        expect(nonFollowing.length).toBeGreaterThan(0)
        expect(unfollow).toContain('octocat')
        expect(follow).toContain('octocat')
    })
})
