"use client";

import Image from "next/image"
import {useState} from "react"
import styles from "./page.module.css"

interface User {
    login: string;
    avatar_url: string;
}

export default function Home() {
    const [username,setUsername]=useState("")
    const [apiKey,setApiKey]=useState("")
    const [nonFollowers, setNonFollowers] = useState<User[]>([])
    const [nonFollowing, setNonFollowing] = useState<User[]>([])
    const [followingUsers, setFollowingUsers] = useState<string[]>([])
    const [unfollowedUsers, setUnfollowedUsers] = useState<string[]>([])

    const fetchAllPages = async (url: string, token: string): Promise<User[]> => {
        let results: User[] = [];
        let page=1;

        try {
            console.log('fetchAllPages')
            let hasMorePages=true;
            while(hasMorePages) {
                const response=await fetch(`${url}?per_page=100&page=${page}`,{
                    headers: {Authorization: `token ${token}`},
                });

                if(!response.ok) {
                    throw new Error(`Erro ao buscar dados na página ${page}: ${response.status} - ${response.statusText}`);
                }

                const data=await response.json();
                results=results.concat(data);
                if(data.length<100) {
                    hasMorePages=false;
                }
                if(data.length<100) break;
                page++;
            }
        } catch(error) {
            if (error instanceof Error) {
                console.error(`Erro ao buscar páginas: ${error.message}`);
            } else {
                console.error('Erro ao buscar páginas:', error);
            }
            throw new Error('Falha ao obter dados de múltiplas páginas.');
        }

        return results;
    }

    const fetchNonFollowers = async (username: string, token: string): Promise<User[]> => {
        try {
            console.log('unfollowNonFollowers')
            const baseUrl = "https://api.github.com";
            const following=await fetchAllPages(
                `${baseUrl}/users/${username}/following`,
                token,
            );

            const followers=await fetchAllPages(
                `${baseUrl}/users/${username}/followers`,
                token,
            );

            const followersLogins=followers.map((follower) => follower.login);

            const nonFollowers=following.filter(
                (user) => !followersLogins.includes(user.login),
            );

            return nonFollowers;
        } catch(error) {
            if (error instanceof Error) {
                console.error(`Erro durante a operação de unfollow: ${error.message}`);
            } else {
                console.error('Erro durante a operação de unfollow:', error);
            }
            throw new Error('Falha ao executar a operação de unfollow.');
        }
    }

    const fetchNonFollowing = async (username: string, token: string): Promise<User[]> => {
        try {
            const baseUrl = "https://api.github.com";
            const followers=await fetchAllPages(
                `${baseUrl}/users/${username}/followers`,
                token,
            );

            const following=await fetchAllPages(
                `${baseUrl}/users/${username}/following`,
                token,
            );

            const followingLogins=following.map((user) => user.login);

            const nonFollowing=followers.filter(
                (user) => !followingLogins.includes(user.login),
            );

            return nonFollowing;
        } catch(error) {
            if (error instanceof Error) {
                console.error(`Erro durante a operação de follow: ${error.message}`);
            } else {
                console.error('Erro durante a operação de follow:', error);
            }
            throw new Error('Falha ao executar a operação de follow.');
        }
    }

    const handleSearchNonFollowers = async () => {
        try {
            const nonFollowers = await fetchNonFollowers(username, apiKey);
            setNonFollowers(nonFollowers);
            const nonFollowing = await fetchNonFollowing(username, apiKey);
            setNonFollowing(nonFollowing);
        } catch (error) {
            console.error('Erro ao buscar não seguidores:', error);
        }
    };

    const handleUnfollow = async (user: string) => {
        try {
            const response = await fetch(`https://api.github.com/user/following/${user}`, {
                method: 'DELETE',
                headers: { Authorization: `token ${apiKey}` },
            });

            if (!response.ok) {
                console.error(`Erro ao deixar de seguir ${user}: ${response.status} - ${response.statusText}`);
                return;
            }

            setNonFollowers((prev) => prev.filter((u) => u.login !== user));
            setUnfollowedUsers((prev) => [...prev, user]);
            await handleSearchNonFollowers();
        } catch (error) {
            console.error(`Erro ao deixar de seguir ${user}:`, error);
        }
    };

    const handleFollow = async (user: string) => {
        try {
            const response = await fetch(`https://api.github.com/user/following/${user}`, {
                method: 'PUT',
                headers: { Authorization: `token ${apiKey}` },
            });

            if (!response.ok) {
                console.error(`Erro ao seguir ${user}: ${response.status} - ${response.statusText}`);
                return;
            }

            setFollowingUsers((prev) => [...prev, user]);
            console.log(`Seguindo o usuário: ${user}`);
        } catch (error) {
            console.error(`Erro ao seguir ${user}:`, error);
        }
    };

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
                    <input
                        type="text"
                        placeholder="GitHub API Key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className={styles.input}
                    />
                    <a href={`https://github.com/settings/personal-access-tokens`} target="_blank" rel="noreferrer">Get your API Key</a>
                    <br />
                    <button onClick={handleSearchNonFollowers} className={styles.button}>Search</button>
                </div>

                <ul className={styles.list}>
                    {nonFollowers.map((user, index) => (
                        <li key={`${user.login}-${index}`} className={styles.listItem}>
                            <Image src={user.avatar_url} alt={user.login} width={50} height={50} className={styles.avatar} />
                            <a href={`https://github.com/${user.login}`}>{user.login}</a>
                            <button onClick={() => handleUnfollow(user.login)} className={styles.button}>
                                {unfollowedUsers.includes(user.login) ? "Deixou de seguir" : "Parar de seguir"}
                            </button>
                        </li>
                    ))}
                </ul>
                <ul className={styles.list}>
                    {nonFollowing.map((user, index) => (
                        <li key={`${user.login}-${index}`} className={styles.listItem}>
                            <Image src={user.avatar_url} alt={user.login} width={50} height={50} className={styles.avatar} />
                            <a href={`https://github.com/${user.login}`}>{user.login}</a>
                            <button onClick={() => handleFollow(user.login)} className={styles.button}>
                                {followingUsers.includes(user.login) ? "Seguindo" : "Seguir"}
                            </button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    )
}
