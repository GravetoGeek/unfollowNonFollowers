import {useState} from 'react'
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

    const handleSearchNonFollowers = async (username: string, token: string) => {
        if (!username || !token) {
            throw new Error("Username and token are required");
        }

        setIsSearching(true)
        try {
            const [nonFollowersResult, nonFollowingResult] = await Promise.all([
                githubService.fetchNonFollowers(username, token),
                githubService.fetchNonFollowing(username, token)
            ])

            setNonFollowers(nonFollowersResult)
            setNonFollowing(nonFollowingResult)
        } finally {
            setIsSearching(false)
        }
    }

    const handleUnfollow = async (userLogin: string, token: string) => {
        setIsUnfollowingUser(userLogin)
        try {
            const success = await githubService.unfollowUser(userLogin, token)
            if (success) {
                setNonFollowers(prev => prev.filter(u => u.login !== userLogin))
                setUnfollowedUsers(prev => [...prev, userLogin])
            }
            return success
        } finally {
            setIsUnfollowingUser("")
        }
    }

    const handleFollow = async (userLogin: string, token: string) => {
        setIsFollowingUser(userLogin)
        try {
            const success = await githubService.followUser(userLogin, token)
            if (success) {
                setFollowingUsers(prev => [...prev, userLogin])
                setNonFollowing(prev => prev.filter(u => u.login !== userLogin))
            }
            return success
        } finally {
            setIsFollowingUser("")
        }
    }

    const handleUnfollowAll = async (token: string) => {
        setIsSearching(true)
        try {
            for (const user of nonFollowers) {
                await handleUnfollow(user.login, token)
            }
        } finally {
            setIsSearching(false)
        }
    }

    const handleFollowAll = async (token: string) => {
        setIsSearching(true)
        try {
            for (const user of nonFollowing) {
                await handleFollow(user.login, token)
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
