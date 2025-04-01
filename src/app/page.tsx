"use client"

import {useEffect,useState} from 'react'
import {UserCard} from './components/UserCard/UserCard'
import type {SupportedLanguages} from './constants/translations'
import {translations} from './constants/translations'
import {useGitHubOperations} from './hooks/useGitHubOperations'
import styles from './page.module.css'
import {GitHubServiceImpl} from './services/GitHubService'

export default function HomePage() {
    const [username, setUsername] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [language, setLanguage] = useState<SupportedLanguages>("pt")

    const githubOperations = useGitHubOperations(new GitHubServiceImpl())
    const {
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
    } = githubOperations

    // Carregar o nome do usuário e a chave da API do localStorage ao inicializar
    useEffect(() => {
        const storedUsername = localStorage.getItem("githubUsername");
        const storedApiKey = localStorage.getItem("githubApiKey");
        if (storedUsername) {
            setUsername(storedUsername);
        }
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);

    // Atualizar o localStorage sempre que o nome do usuário ou a chave da API mudar
    useEffect(() => {
        if (username) {
            localStorage.setItem("githubUsername", username);
        }
    }, [username]);

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem("githubApiKey", apiKey);
        }
    }, [apiKey]);

    // Função para limpar a chave da API
    const handleClearApiKey=() => {
        setApiKey("")
        localStorage.removeItem("githubApiKey")
    }

    const handleClearUsername = () => {
        setUsername("");
        localStorage.removeItem("githubUsername");
    };

    const handleSearch = async () => {
        if (!username || !apiKey) {
            alert(translations[language].errorMissingCredentials);
            return;
        }
        try {
            await handleSearchNonFollowers(username, apiKey);
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred");
        }
    }

    const handleUnfollowClick = async (userLogin: string) => {
        try {
            await handleUnfollow(userLogin, apiKey);
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred");
        }
    }

    const handleFollowClick = async (userLogin: string) => {
        try {
            await handleFollow(userLogin, apiKey);
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred");
        }
    }

    const handleUnfollowAllClick = async () => {
        if (!apiKey) {
            alert(translations[language].errorMissingCredentials);
            return;
        }

        const confirmUnfollow = confirm(translations[language].confirmUnfollowAll);
        if (!confirmUnfollow) return;

        try {
            await handleUnfollowAll(apiKey);
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred");
        }
    }

    const handleFollowAllClick = async () => {
        if (!apiKey) {
            alert(translations[language].errorMissingCredentials);
            return;
        }

        const confirmFollow = confirm(translations[language].confirmFollowAll);
        if (!confirmFollow) return;

        try {
            await handleFollowAll(apiKey);
        } catch (error) {
            alert(error instanceof Error ? error.message : "An error occurred");
        }
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.ctas}>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as SupportedLanguages)}
                        className={styles.input}
                    >
                        <option value="pt">Português</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                        <option value="hi">हिन्दी</option>
                        <option value="ar">العربية</option>
                        <option value="ja">日本語</option>
                    </select>

                    <div className={styles.inputContainer}>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder={translations[language].githubUsername}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                            />
                            <button
                                onClick={handleClearUsername}
                                className={styles.clearButton}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                placeholder={translations[language].githubApiKey}
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
                    </div>

                    <a
                        href={`https://github.com/settings/personal-access-tokens`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {translations[language].getApiKey}
                    </a>

                    <div className={styles.buttonGroup}>
                        <button onClick={handleSearch} className={styles.button} disabled={isSearching}>
                            {isSearching ? translations[language].searching : translations[language].search}
                        </button>
                        <button
                            onClick={handleUnfollowAllClick}
                            className={styles.button}
                            disabled={isUnfollowingUser !== "" || nonFollowers.length === 0}
                        >
                            {isUnfollowingUser !== ""
                                ? translations[language].unfollowingAll
                                : translations[language].unfollowAll}
                        </button>
                        <button
                            onClick={handleFollowAllClick}
                            className={styles.button}
                            disabled={isFollowingUser !== "" || nonFollowing.length === 0}
                        >
                            {isFollowingUser !== ""
                                ? translations[language].followingAll
                                : translations[language].followAll}
                        </button>
                    </div>
                </div>

                <div className={styles.listsContainer}>
                    <section className={styles.listSection}>
                        <h2 className={styles.listHeader}>{translations[language].nonFollowers}</h2>
                        <ul className={styles.list}>
                            {nonFollowers.map((user) => (
                                <UserCard
                                    key={user.login}
                                    user={user}
                                    onUnfollow={handleUnfollowClick}
                                    onFollow={handleFollowClick}
                                    isUnfollowing={isUnfollowingUser === user.login}
                                    isFollowing={isFollowingUser === user.login}
                                    hasUnfollowed={unfollowedUsers.includes(user.login)}
                                    isCurrentlyFollowing={!unfollowedUsers.includes(user.login)} // Alterado aqui
                                    language={language}
                                />
                            ))}
                            {nonFollowers.length === 0 && !isSearching && (
                                <li className={styles.listItem}>{translations[language].noUsersFound}</li>
                            )}
                            {isSearching && <li className={styles.listItem}>{translations[language].searching}</li>}
                        </ul>
                    </section>

                    <section className={styles.listSection}>
                        <h2 className={styles.listHeader}>{translations[language].nonFollowing}</h2>
                        <ul className={styles.list}>
                            {nonFollowing.map((user) => (
                                <UserCard
                                    key={user.login}
                                    user={user}
                                    onUnfollow={() => {}} // Unfollow action is not relevant here
                                    onFollow={handleFollowClick}
                                    isUnfollowing={false}
                                    isFollowing={isFollowingUser === user.login}
                                    hasUnfollowed={false}
                                    isCurrentlyFollowing={followingUsers.includes(user.login)}
                                    language={language} // Passa o idioma selecionado
                                />
                            ))}
                            {nonFollowing.length === 0 && !isSearching && (
                                <li className={styles.listItem}>{translations[language].noUsersFound}</li>
                            )}
                            {isSearching && <li className={styles.listItem}>{translations[language].searching}</li>}
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    )
}