import {useCallback,useState} from 'react'
import {SupportedLanguages,translations} from '../constants/translations'
import {GitHubService} from '../interfaces/GitHubService'
import {User} from '../interfaces/User'

export const useGitHubOperations=(githubService: GitHubService) => {
    const [nonFollowers,setNonFollowers]=useState<User[]>([])
    const [nonFollowing,setNonFollowing]=useState<User[]>([])
    const [unfollowedUsers,setUnfollowedUsers]=useState<string[]>([])
    const [followingUsers,setFollowingUsers]=useState<string[]>([])
    const [isSearching,setIsSearching]=useState(false)
    // conjuntos de usuários sendo processados em paralelo
    const [unfollowingSet,setUnfollowingSet]=useState<Set<string>>(new Set())
    const [followingSet,setFollowingSet]=useState<Set<string>>(new Set())
    const isUnfollowingAny=unfollowingSet.size>0
    const isFollowingAny=followingSet.size>0
    const isUnfollowingUser=useCallback((login: string) => unfollowingSet.has(login),[unfollowingSet])
    const isFollowingUser=useCallback((login: string) => followingSet.has(login),[followingSet])

    const handleSearchNonFollowers=async (username: string,token: string,language: SupportedLanguages) => {
        if(!username||!token) {
            throw new Error(translations[language].errorMissingCredentials)
        }

        setIsSearching(true)
        try {
            const [nonFollowersResult,nonFollowingResult]=await Promise.all([
                githubService.fetchNonFollowers(username,token,language),
                githubService.fetchNonFollowing(username,token,language)
            ])

            setNonFollowers(nonFollowersResult)
            setNonFollowing(nonFollowingResult)
        } finally {
            setIsSearching(false)
        }
    }

    const handleUnfollow=async (userLogin: string,token: string,language: SupportedLanguages) => {
        setUnfollowingSet(prev => {
            const next=new Set(prev)
            next.add(userLogin)
            return next
        })
        try {
            const success=await githubService.unfollowUser(userLogin,token,language)
            if(success) {
                setNonFollowers(prev => prev.filter(u => u.login!==userLogin))
                setUnfollowedUsers(prev => [...prev,userLogin])
            }
            return success
        } catch(error) {
            console.error(error)
            if(error instanceof Error) {
                throw error
            }
            throw new Error(translations[language].catchErrorMessage.genericUnfollowUser)
        } finally {
            setUnfollowingSet(prev => {
                const next=new Set(prev)
                next.delete(userLogin)
                return next
            })
        }
    }

    const handleFollow=async (userLogin: string,token: string,language: SupportedLanguages) => {
        setFollowingSet(prev => {
            const next=new Set(prev)
            next.add(userLogin)
            return next
        })
        try {
            const success=await githubService.followUser(userLogin,token,language)
            if(success) {
                setFollowingUsers(prev => [...prev,userLogin])
                setNonFollowing(prev => prev.filter(u => u.login!==userLogin))
            }
            return success
        } catch(error) {
            console.error(error)
            if(error instanceof Error) {
                throw error
            }
            throw new Error(translations[language].catchErrorMessage.genericFollowUser)
        } finally {
            setFollowingSet(prev => {
                const next=new Set(prev)
                next.delete(userLogin)
                return next
            })
        }
    }

    const handleUnfollowAll=async (token: string,language: SupportedLanguages) => {
        // processa em paralelo em lotes para acelerar e evitar rate limit agressivo
        const users=[...nonFollowers]
        const batchSize=6
        setIsSearching(true)
        try {
            for(let i=0;i<users.length;i+=batchSize) {
                const batch=users.slice(i,i+batchSize)
                await Promise.allSettled(
                    batch.map(u => handleUnfollow(u.login,token,language))
                )
            }
        } finally {
            setIsSearching(false)
        }
    }

    const handleFollowAll=async (token: string,language: SupportedLanguages) => {
        // processa em paralelo em lotes para acelerar e evitar rate limit agressivo
        const users=[...nonFollowing]
        const batchSize=6
        setIsSearching(true)
        try {
            for(let i=0;i<users.length;i+=batchSize) {
                const batch=users.slice(i,i+batchSize)
                await Promise.allSettled(
                    batch.map(u => handleFollow(u.login,token,language))
                )
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
        isUnfollowingAny,
        isFollowingAny,
        isUnfollowingUser,
        isFollowingUser,
        handleSearchNonFollowers,
        handleUnfollow,
        handleFollow,
        handleUnfollowAll,
        handleFollowAll
    }
}
