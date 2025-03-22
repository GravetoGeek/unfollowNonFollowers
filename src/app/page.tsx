"use client"

import Image from "next/image"
import {useEffect,useState} from "react"
import styles from "./page.module.css"

/**
 * @interface User
 * Represents a GitHub user with their login and avatar URL.
 */
interface User {
    login: string
    avatar_url: string
}

/**
 * @interface GitHubService
 * Defines the contract for interacting with the GitHub API.
 */
interface GitHubService {
    fetchAllPages<T>(url: string,token: string): Promise<T[]>
    fetchNonFollowers(username: string,token: string): Promise<User[]>
    fetchNonFollowing(username: string,token: string): Promise<User[]>
    unfollowUser(usernameToUnfollow: string,token: string): Promise<boolean>
    followUser(usernameToFollow: string,token: string): Promise<boolean>
}

/**
 * @class GitHubServiceImpl
 * Implements the GitHubService interface to handle API calls.
 */
class GitHubServiceImpl implements GitHubService {
    private readonly baseUrl="https://api.github.com";

    /**
     * @async
     * @method fetchAllPages
     * Fetches data from a paginated API endpoint until all pages are retrieved.
     * @param {string} url - The base URL of the API endpoint.
     * @param {string} token - The GitHub API token for authorization.
     * @returns {Promise<T[]>} - A promise that resolves to an array of data from all pages.
     * @throws {Error} - If there is an error fetching data from any page.
     */
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

    /**
     * @async
     * @method fetchNonFollowers
     * Retrieves a list of users that the authenticated user is following but are not following back.
     * @param {string} username - The GitHub username of the authenticated user.
     * @param {string} token - The GitHub API token for authorization.
     * @returns {Promise<User[]>} - A promise that resolves to an array of non-followers.
     * @throws {Error} - If there is an error fetching following or followers data.
     */
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

    /**
     * @async
     * @method fetchNonFollowing
     * Retrieves a list of users that are following the authenticated user but the authenticated user is not following back.
     * @param {string} username - The GitHub username of the authenticated user.
     * @param {string} token - The GitHub API token for authorization.
     * @returns {Promise<User[]>} - A promise that resolves to an array of non-following users.
     * @throws {Error} - If there is an error fetching followers or following data.
     */
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

    /**
     * @async
     * @method unfollowUser
     * Unfollows a specified GitHub user.
     * @param {string} usernameToUnfollow - The login of the user to unfollow.
     * @param {string} token - The GitHub API token for authorization.
     * @returns {Promise<boolean>} - A promise that resolves to true if the unfollow operation was successful.
     * @throws {Error} - If there is an error during the unfollow operation.
     */
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

    /**
     * @async
     * @method followUser
     * Follows a specified GitHub user.
     * @param {string} usernameToFollow - The login of the user to follow.
     * @param {string} token - The GitHub API token for authorization.
     * @returns {Promise<boolean>} - A promise that resolves to true if the follow operation was successful.
     * @throws {Error} - If there is an error during the follow operation.
     */
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

/**
 * @interface UserCardProps
 * Defines the properties for the UserCard component.
 */
interface UserCardProps {
    user: User
    onUnfollow: (login: string) => void
    onFollow: (login: string) => void
    isUnfollowing: boolean
    isFollowing: boolean
    hasUnfollowed: boolean
    isCurrentlyFollowing: boolean
}

/**
 * @component UserCard
 * Displays information about a user and provides actions to follow or unfollow.
 */
const UserCard: React.FC<UserCardProps>=({
    user,
    onUnfollow,
    onFollow,
    isUnfollowing,
    isFollowing,
    hasUnfollowed,
    isCurrentlyFollowing,
}) => {
    return (
        <li className={styles.listItem}>
            <Image src={user.avatar_url} alt={user.login} width={50} height={50} className={styles.avatar} />
            <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer">{user.login}</a>
            {!isCurrentlyFollowing&&!hasUnfollowed&&(
                <button
                    onClick={() => onFollow(user.login)}
                    className={styles.button}
                    disabled={isFollowing}
                >
                    {isFollowing? "Seguindo...":"Seguir"}
                </button>
            )}
            {isCurrentlyFollowing&&!hasUnfollowed&&(
                <button
                    onClick={() => onUnfollow(user.login)}
                    className={styles.button}
                    disabled={isUnfollowing}
                >
                    {isUnfollowing? "Deixando de seguir...":"Parar de seguir"}
                </button>
            )}
            {hasUnfollowed&&<span>Deixou de seguir</span>}
            {isCurrentlyFollowing&&!hasUnfollowed&&<span>Seguindo</span>}
        </li>
    )
}

/**
 * @component HomePage
 * The main component of the application, responsible for fetching and displaying non-followers and users not being followed back.
 */
export default function HomePage() {
    const [username,setUsername]=useState("")
    const [apiKey,setApiKey]=useState("")
    const [nonFollowers,setNonFollowers]=useState<User[]>([])
    const [nonFollowing,setNonFollowing]=useState<User[]>([])
    const [unfollowedUsers,setUnfollowedUsers]=useState<string[]>([])
    const [followingUsers,setFollowingUsers]=useState<string[]>([])
    const [isSearching,setIsSearching]=useState(false)
    const [isUnfollowingUser,setIsUnfollowingUser]=useState("")
    const [isFollowingUser,setIsFollowingUser]=useState("")
    const [githubService]=useState<GitHubService>(() => new GitHubServiceImpl())

    // Carregar a chave da API do localStorage ao inicializar
    useEffect(() => {
        const storedApiKey = localStorage.getItem("githubApiKey");
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    // Atualizar o localStorage sempre que a chave da API mudar
    useEffect(() => {
        if (apiKey) {
            localStorage.setItem("githubApiKey", apiKey);
        }
    }, [apiKey]);

    // Função para limpar a chave da API
    const handleClearApiKey = () => {
        setApiKey("");
        localStorage.removeItem("githubApiKey");
    };

    /**
     * @async
     * @function handleSearchNonFollowers
     * Fetches the list of non-followers and users not being followed back from GitHub.
     */
    const handleSearchNonFollowers=async () => {
        if(!username||!apiKey) {
            alert("Por favor, insira seu nome de usuário e chave da API do GitHub.")
            return
        }

        setIsSearching(true)
        setNonFollowers([])
        setNonFollowing([])

        try {
            const nonFollowersResult=await githubService.fetchNonFollowers(username,apiKey)
            setNonFollowers(nonFollowersResult)
            const nonFollowingResult=await githubService.fetchNonFollowing(username,apiKey)
            setNonFollowing(nonFollowingResult)
        } catch(error) {
            console.error('Erro ao buscar não seguidores:',error)
            if(error instanceof Error) {
                alert(`Erro ao buscar não seguidores: ${error.message}`)
            } else {
                alert('Erro ao buscar não seguidores.')
            }
        } finally {
            setIsSearching(false)
        }
    }

    /**
     * @async
     * @function handleUnfollow
     * Unfollows a specific user on GitHub.
     * @param {string} userLogin - The login of the user to unfollow.
     */
    const handleUnfollow=async (userLogin: string) => {
        if(!apiKey) {
            alert("Por favor, insira sua chave da API do GitHub.")
            return
        }

        setIsUnfollowingUser(userLogin)
        try {
            const success=await githubService.unfollowUser(userLogin,apiKey)
            if(success) {
                setNonFollowers((prev) => prev.filter((u) => u.login!==userLogin))
                setUnfollowedUsers((prev) => [...prev,userLogin])
                // Optionally, refresh the non-followers list to reflect the change immediately
                // await handleSearchNonFollowers();
            }
        } catch(error) {
            console.error(`Erro ao deixar de seguir ${userLogin}:`,error)
            if(error instanceof Error) {
                alert(`Erro ao deixar de seguir ${userLogin}: ${error.message}`)
            } else {
                alert(`Erro ao deixar de seguir ${userLogin}.`)
            }
        } finally {
            setIsUnfollowingUser("")
        }
    }

    /**
     * @async
     * @function handleFollow
     * Follows a specific user on GitHub.
     * @param {string} userLogin - The login of the user to follow.
     */
    const handleFollow=async (userLogin: string) => {
        if(!apiKey) {
            alert("Por favor, insira sua chave da API do GitHub.")
            return
        }

        setIsFollowingUser(userLogin)
        try {
            const success=await githubService.followUser(userLogin,apiKey)
            if(success) {
                setFollowingUsers((prev) => [...prev,userLogin])
                setNonFollowing((prev) => prev.filter((u) => u.login!==userLogin)) // Remove o usuário da lista
            }
        } catch(error) {
            console.error(`Erro ao seguir ${userLogin}:`,error)
            if(error instanceof Error) {
                alert(`Erro ao seguir ${userLogin}: ${error.message}`)
            } else {
                alert(`Erro ao seguir ${userLogin}.`)
            }
        } finally {
            setIsFollowingUser("")
        }
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.ctas}>
                    <input
                        type="text"
                        placeholder="GitHub Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.input}
                    />
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            placeholder="GitHub API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className={styles.input}
                        />
                        <button
                            onClick={handleClearApiKey}
                            className={styles.clearButton}
                        >
                            ✕
                        </button>
                    </div>
                    <a
                        href={`https://github.com/settings/personal-access-tokens`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Obtenha sua chave da API
                    </a>
                    <br />
                    <button onClick={handleSearchNonFollowers} className={styles.button} disabled={isSearching}>
                        {isSearching ? "Buscando..." : "Buscar"}
                    </button>
                </div>

                <h2>Usuários que você segue e não te seguem:</h2>
                <ul className={styles.list}>
                    {nonFollowers.map((user) => (
                        <UserCard
                            key={user.login}
                            user={user}
                            onUnfollow={handleUnfollow}
                            onFollow={() => {}} // Follow action is not relevant here
                            isUnfollowing={isUnfollowingUser===user.login}
                            isFollowing={false}
                            hasUnfollowed={unfollowedUsers.includes(user.login)}
                            isCurrentlyFollowing={false}
                        />
                    ))}
                    {nonFollowers.length===0&&!isSearching&&<li className={styles.listItem}>Nenhum usuário encontrado.</li>}
                    {isSearching&&<li className={styles.listItem}>Buscando usuários...</li>}
                </ul>

                <h2>Usuários que te seguem e você não segue:</h2>
                <ul className={styles.list}>
                    {nonFollowing.map((user) => (
                        <UserCard
                            key={user.login}
                            user={user}
                            onUnfollow={() => {}} // Unfollow action is not relevant here
                            onFollow={handleFollow}
                            isUnfollowing={false}
                            isFollowing={isFollowingUser===user.login}
                            hasUnfollowed={false}
                            isCurrentlyFollowing={followingUsers.includes(user.login)}
                        />
                    ))}
                    {nonFollowing.length===0&&!isSearching&&<li className={styles.listItem}>Nenhum usuário encontrado.</li>}
                    {isSearching&&<li className={styles.listItem}>Buscando usuários...</li>}
                </ul>
            </main>
        </div>
    )
}