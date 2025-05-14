import {SupportedLanguages,translations} from '../constants/translations'
import {GitHubService} from '../interfaces/GitHubService'
import {User} from '../interfaces/User'

export class GitHubServiceImpl implements GitHubService {
    private readonly baseUrl="https://api.github.com";

    async fetchAllPages<T>(url: string,token: string,language: SupportedLanguages): Promise<T[]> {
        let results: T[]=[] // Rewritten line
        let currentPage=1
        let hasMorePages=true

        try {
            while(hasMorePages) {
                const response=await fetch(`${url}?per_page=100&page=${currentPage}`,{
                    headers: {Authorization: `token ${token}`},
                })
                if(!response.ok) {
                    if(response.status==401){
                        throw new Error(translations[language].httpErrorMessage[response.status].join('\n'))
                    }
                    throw new Error(translations[language].catchErrorMessage.fetchOnePage({currentPage,status:response.status,statusText:response.statusText}))
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
                throw new Error(translations[language].catchErrorMessage.fetchManyPages({message:error.message}))
            } else {
                throw new Error(translations[language].catchErrorMessage.genericFetchManyPages)
            }
        }

        return results
    }

    async fetchNonFollowers(username: string,token: string,language:SupportedLanguages): Promise<User[]> {
        try {
            const following=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/following`,
                token,
                language,
            )

            const followers=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/followers`,
                token,
                language,
            )

            const followersLogins=followers.map((follower) => follower.login)

            const nonFollowersResult=following.filter(
                (user) => !followersLogins.includes(user.login),
            )

            return nonFollowersResult
        } catch(error) {
            console.error('Erro ao buscar não seguidores:',error)
            if(error instanceof Error) {
                throw new Error(translations[language].catchErrorMessage.fetchNonFollowers({message:error.message}))
            } else {
                throw new Error(translations[language].catchErrorMessage.genericFetchNonFollowers)
            }
        }
    }

    async fetchNonFollowing(username: string,token: string,language:SupportedLanguages): Promise<User[]> {
        try {
            const followers=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/followers`,
                token,
                language,
            )

            const following=await this.fetchAllPages<User>(
                `${this.baseUrl}/users/${username}/following`,
                token,
                language,
            )

            const followingLogins=following.map((user) => user.login)

            const nonFollowingResult=followers.filter(
                (user) => !followingLogins.includes(user.login),
            )

            return nonFollowingResult
        } catch(error) {
            console.error('Erro ao buscar não seguidos:',error)
            if(error instanceof Error) {
                throw new Error(translations[language].catchErrorMessage.fetchNonFollowing({message:error.message}))
            } else {
                throw new Error(translations[language].catchErrorMessage.genericFetchNonFollowing)
            }
        }
    }

    async unfollowUser(usernameToUnfollow: string,token: string,language:SupportedLanguages): Promise<boolean> {
        try {
            const response=await fetch(`${this.baseUrl}/user/following/${usernameToUnfollow}`,{
                method: 'DELETE',
                headers: {Authorization: `token ${token}`},
            })


            if(!response.ok) {
                // console.error(`Erro ao deixar de seguir ${usernameToUnfollow}: ${response.status} - ${response.statusText}`)
                if (response.status === 403) {
                    throw new Error(translations[language].httpErrorMessage[403]?.join('\n') || 'Acesso proibido.');
                }
                return false
            }

            return true
        } catch(error) {
            // console.error(`Erro ao deixar de seguir ${usernameToUnfollow}:`,error)
            if(error instanceof Error) {
                throw new Error(translations[language].catchErrorMessage.unfollowUser({username:usernameToUnfollow,message:error.message}))
            } else {
                throw new Error(translations[language].catchErrorMessage.genericUnfollowUser)
            }
        }
    }

    async followUser(usernameToFollow: string,token: string,language:SupportedLanguages): Promise<boolean> {
        try {
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
            if(error instanceof Error) {
                throw new Error(translations[language].catchErrorMessage.followUser({username:usernameToFollow,message:error.message}))
            } else {
                throw new Error(translations[language].catchErrorMessage.genericFollowUser)
            }
        }
    }
}