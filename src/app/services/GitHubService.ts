import {GitHubService} from '../interfaces/GitHubService'
import {User} from '../interfaces/User'

export class GitHubServiceImpl implements GitHubService {
    private readonly baseUrl="https://api.github.com";

    async fetchAllPages<T>(url: string,token: string): Promise<T[]> {
        let results: T[]=[] // Rewritten line
        let currentPage=1
        let hasMorePages=true

        try {
            console.log('fetchAllPages - Fetching data from:',url)
            while(hasMorePages) {
                const response=await fetch(`${url}?per_page=100&page=${currentPage}`,{
                    headers: {Authorization: `token ${token}`},
                })

                if(!response.ok) {
                    throw new Error(`Erro ao buscar dados na página ${currentPage}: ${response.status} - ${response.statusText}`)
                }

                const data: T[]=await response.json()
                results=results.concat(data)

                if(data.length<100) {
                    hasMorePages=false
                }

                currentPage++
            }
        } catch(error) {
            console.error('Erro ao buscar páginas:',error)
            if(error instanceof Error) {
                throw new Error(`Falha ao obter dados de múltiplas páginas: ${error.message}`)
            } else {
                throw new Error('Falha ao obter dados de múltiplas páginas.')
            }
        }

        return results
    }

    async fetchNonFollowers(username: string,token: string): Promise<User[]> {
        try {
            console.log('fetchNonFollowers - Fetching non-followers for:',username)
            const following=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/following`,
                token,
            )

            const followers=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/followers`,
                token,
            )

            const followersLogins=followers.map((follower) => follower.login)

            const nonFollowersResult=following.filter(
                (user) => !followersLogins.includes(user.login),
            )

            return nonFollowersResult
        } catch(error) {
            console.error('Erro ao buscar não seguidores:',error)
            if(error instanceof Error) {
                throw new Error(`Falha ao buscar não seguidores: ${error.message}`)
            } else {
                throw new Error('Falha ao buscar não seguidores.')
            }
        }
    }

    async fetchNonFollowing(username: string,token: string): Promise<User[]> {
        try {
            console.log('fetchNonFollowing - Fetching non-following for:',username)
            const followers=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/followers`,
                token,
            )

            const following=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/following`,
                token,
            )

            const followingLogins=following.map((user) => user.login)

            const nonFollowingResult=followers.filter(
                (user) => !followingLogins.includes(user.login),
            )

            return nonFollowingResult
        } catch(error) {
            console.error('Erro ao buscar não seguidos:',error)
            if(error instanceof Error) {
                throw new Error(`Falha ao buscar não seguidos: ${error.message}`)
            } else {
                throw new Error('Falha ao buscar não seguidos.')
            }
        }
    }

    async unfollowUser(usernameToUnfollow: string,token: string): Promise<boolean> {
        try {
            console.log(`unfollowUser - Unfollowing user: ${usernameToUnfollow}`)
            const response=await fetch(`${this.baseUrl}/user/following/${usernameToUnfollow}`,{
                method: 'DELETE',
                headers: {Authorization: `token ${token}`},
            })

            if(!response.ok) {
                console.error(`Erro ao deixar de seguir ${usernameToUnfollow}: ${response.status} - ${response.statusText}`)
                return false
            }

            return true
        } catch(error) {
            console.error(`Erro ao deixar de seguir ${usernameToUnfollow}:`,error)
            if(error instanceof Error) {
                throw new Error(`Falha ao deixar de seguir ${usernameToUnfollow}: ${error.message}`)
            } else {
                throw new Error(`Falha ao deixar de seguir ${usernameToUnfollow}.`)
            }
        }
    }

    async followUser(usernameToFollow: string,token: string): Promise<boolean> {
        try {
            console.log(`followUser - Following user: ${usernameToFollow}`)
            const response=await fetch(`${this.baseUrl}/user/following/${usernameToFollow}`,{
                method: 'PUT',
                headers: {Authorization: `token ${token}`},
            })

            if(!response.ok) {
                console.error(`Erro ao seguir ${usernameToFollow}: ${response.status} - ${response.statusText}`)
                return false
            }

            return true
        } catch(error) {
            console.error(`Erro ao seguir ${usernameToFollow}:`,error)
            if(error instanceof Error) {
                throw new Error(`Falha ao seguir ${usernameToFollow}: ${error.message}`)
            } else {
                throw new Error(`Falha ao seguir ${usernameToFollow}.`)
            }
        }
    }
}