import {useState} from 'react'
import {SupportedLanguages,translations} from '../constants/translations'
import {GitHubService} from '../interfaces/GitHubService'
import {User} from '../interfaces/User'

export const useGitHubOperations = (githubService: GitHubService) => {
    const [nonFollowers, setNonFollowers] = useState<User[]>([])
    const [nonFollowing, setNonFollowing] = useState<User[]>([])
    const [unfollowedUsers, setUnfollowedUsers] = useState<string[]>([])
    const [followingUsers, setFollowingUsers] = useState<string[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [isUnfollowingUser, setIsUnfollowingUser] = useState("")
    const [isFollowingUser, setIsFollowingUser] = useState("")

    const handleSearchNonFollowers = async (username: string, token: string, language: SupportedLanguages) => {
        if (!username || !token) {
            throw new Error(translations[language].errorMissingCredentials);
        }

        setIsSearching(true)
        try {
            const [nonFollowersResult, nonFollowingResult] = await Promise.all([
                githubService.fetchNonFollowers(username, token, language),
                githubService.fetchNonFollowing(username, token,language)
            ])

            setNonFollowers(nonFollowersResult)
            setNonFollowing(nonFollowingResult)
        } finally {
            setIsSearching(false)
        }
    }

    const handleUnfollow = async (userLogin: string, token: string, language: SupportedLanguages) => {
        setIsUnfollowingUser(userLogin)
        try {
            const success = await githubService.unfollowUser(userLogin, token, language)
            if (success) {
                setNonFollowers(prev => prev.filter(u => u.login !== userLogin))
                setUnfollowedUsers(prev => [...prev, userLogin])
            }
            return success
        } catch (error) {
            console.error(error)
            throw new Error(translations[language].httpErrorMessage[401].join('\n'));
        } finally {
            setIsUnfollowingUser("")
        }
    }

    const handleFollow = async (userLogin: string, token: string, language: SupportedLanguages) => {
        setIsFollowingUser(userLogin)
        try {
            const success = await githubService.followUser(userLogin, token, language)
            if (success) {
                setFollowingUsers(prev => [...prev, userLogin])
                setNonFollowing(prev => prev.filter(u => u.login !== userLogin))
            }
            return success
        } catch (error) {
            console.error(error)
            throw new Error(translations[language].httpErrorMessage[401].join('\n'));
        } finally {
            setIsFollowingUser("")
        }
    }

    const handleUnfollowAll = async (token: string, language: SupportedLanguages) => {
        setIsSearching(true)
        try {
            for (const user of nonFollowers) {
                await handleUnfollow(user.login, token, language)
            }
        } finally {
            setIsSearching(false)
        }
    }

    const handleFollowAll = async (token: string, language: SupportedLanguages) => {
        setIsSearching(true)
        try {
            for (const user of nonFollowing) {
                await handleFollow(user.login, token, language)
            }
        } finally {
            setIsSearching(false)
        }
    }

    return {
        nonFollowers,
        nonFollowing,
        unfollowedUsers,
        followingUsers,
        isSearching,
        isUnfollowingUser,
        isFollowingUser,
        handleSearchNonFollowers,
        handleUnfollow,
        handleFollow,
        handleUnfollowAll,
        handleFollowAll
    }
}
