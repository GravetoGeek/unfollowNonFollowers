"use client"

import parse from 'html-react-parser'
import { useEffect, useMemo, useState } from 'react'
import ConfirmationModal from './components/Modal/ConfirmationModal'
import Modal from './components/Modal/Modal'
import { UserCard } from './components/UserCard/UserCard'
import { SupportedLanguages, translations } from './constants/translations'
import { useGitHubOperations } from './hooks/useGitHubOperations'
import styles from './page.module.css'
import { GitHubServiceImpl } from './services/GitHubService'

export default function HomePage() {
    const [username, setUsername] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [language, setLanguage] = useState<SupportedLanguages>("pt");
    const [primaryVariant, setPrimaryVariant] = useState<'success' | 'violet'>(() => {
        try { return (localStorage.getItem('primaryVariant') as 'success' | 'violet') || 'success' } catch { return 'success' }
    });
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [onConfirm, setOnConfirm] = useState<(() => Promise<void>) | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("light")
    const [stats, setStats] = useState<{ visitors: number, lastUsers: string[] }>({ visitors: 0, lastUsers: [] })

    const gitHubService = useMemo(() => new GitHubServiceImpl(), [])
    const githubOperations = useGitHubOperations(gitHubService)
    const {
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
    } = githubOperations

    // Carregar tema
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null
        if (storedTheme) {
            setTheme(storedTheme)
            document.documentElement.setAttribute("data-theme", storedTheme)
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark")
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
    }

    // Carregar o nome do usuário e a chave da API do localStorage ao inicializar
    useEffect(() => {
        const storedUsername = localStorage.getItem("githubUsername")
        const storedApiKey = localStorage.getItem("githubApiKey")
        if (storedUsername) {
            setUsername(storedUsername)
        }
        if (storedApiKey) {
            setApiKey(storedApiKey)
        }

        // Fetch stats
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(console.error)
    }, [])

    // Atualizar o localStorage sempre que o nome do usuário ou a chave da API mudar
    useEffect(() => {
        if (username) {
            localStorage.setItem("githubUsername", username)
        }
    }, [username])

    useEffect(() => {
        if (apiKey) {
            localStorage.setItem("githubApiKey", apiKey)
        }
    }, [apiKey])

    useEffect(() => {
        try { localStorage.setItem('primaryVariant', primaryVariant) } catch { }
        document.documentElement.setAttribute('data-primary-variant', primaryVariant)
    }, [primaryVariant])

    const handleClearApiKey = () => {
        setApiKey("")
        localStorage.removeItem("githubApiKey")
    }

    const handleClearUsername = () => {
        setUsername("")
        localStorage.removeItem("githubUsername")
    }

    const handleSearch = async () => {
        if (!username || !apiKey) {
            setModalMessage(translations[language].errorMissingCredentials)
            return
        }
        try {
            await handleSearchNonFollowers(username, apiKey, language)
            // Update stats after search
            fetch('/api/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })
                .then(res => res.json())
                .then(data => setStats(data))
                .catch(console.error)
        } catch (error) {
            setModalMessage(error instanceof Error ? error.message : "An error occurred")
        }
    }

    const handleUnfollowClick = async (userLogin: string) => {
        try {
            await handleUnfollow(userLogin, apiKey, language)
        } catch (error) {
            setModalMessage(error instanceof Error ? error.message : "An error occurred")
        }
    }

    const handleFollowClick = async (userLogin: string) => {
        try {
            await handleFollow(userLogin, apiKey, language)
        } catch (error) {
            setModalMessage(error instanceof Error ? error.message : "An error occurred")
        }
    }

    const handleUnfollowAllClick = () => {
        if (!apiKey) {
            setModalMessage(translations[language].errorMissingCredentials)
            return
        }

        setConfirmationMessage(translations[language].confirmUnfollowAll)
        setOnConfirm(() => async () => {
            try {
                await handleUnfollowAll(apiKey, language)
                await setConfirmationMessage(null)
                await setOnConfirm(null)
            } catch (error) {
                setModalMessage(error instanceof Error ? error.message : "An error occurred")
            }
        })
    }

    const handleFollowAllClick = () => {
        if (!apiKey) {
            setModalMessage(translations[language].errorMissingCredentials)
            return
        }

        setConfirmationMessage(translations[language].confirmFollowAll)
        setOnConfirm(() => async () => {
            try {
                await handleFollowAll(apiKey, language)
                setConfirmationMessage(null)
                setOnConfirm(null)
            } catch (error) {
                setModalMessage(error instanceof Error ? error.message : "An error occurred")
            }
        })
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {/* Modal de mensagem */}
                {modalMessage && (
                    <Modal
                        message={parse(modalMessage)}
                        onClose={() => setModalMessage(null)}
                        language={language}
                    />
                )}
                {/* Modal de confirmação */}
                {confirmationMessage && (
                    <ConfirmationModal
                        message={confirmationMessage}
                        onConfirm={async () => {
                            if (onConfirm) {
                                await onConfirm()
                            }
                        }}
                        onCancel={() => {
                            setConfirmationMessage(null)
                            setOnConfirm(null)
                        }}
                        language={language}
                    />
                )}

                <div className={styles.ctas}>
                    <div className={styles.topControls}>
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={`${styles.button} ${styles.iconButton}`}
                            aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 
7 7 0 0 0 21 12.79z" /></svg>) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path
                                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>)}
                        </button>

                        {/* Primary Variant Select */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <label className="sr-only">Tema primário</label>
                            <select
                                value={primaryVariant}
                                onChange={(e) => setPrimaryVariant(e.target.value as 'success' | 'violet')}
                                className={`${styles.input} ${styles.halfSelect}`}
                                style={{ width: 'auto' }}
                            >
                                <option value="success">Verde</option>
                                <option value="violet">Roxo</option>
                            </select>
                        </div>

                        {/* Language Select */}
                        <select
                            id="language-select"
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
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="username-input" className="sr-only">{translations[language].githubUsername}</label>
                            <input
                                id="username-input"
                                type="text"
                                placeholder={translations[language].githubUsername}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={styles.input}
                            />
                            <button
                                type="button"
                                id="clear-username-button"
                                onClick={handleClearUsername}
                                className={styles.clearButton}
                            >
                                ✕
                            </button>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="api-key-input" className="sr-only">{translations[language].githubApiKey}</label>
                            <input
                                id="api-key-input"
                                type={showApiKey ? "text" : "password"}
                                placeholder={translations[language].githubApiKey}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className={styles.input}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                aria-label={showApiKey ? 'Ocultar chave' : 'Mostrar chave'}
                                onClick={() => setShowApiKey(v => !v)}
                                className={styles.toggleButton}
                                title={showApiKey ? 'Ocultar' : 'Mostrar'}
                            >
                                {showApiKey ? '🙈' : '👁️'}
                            </button>
                            <button
                                type="button"
                                id="clear-api-key-button"
                                onClick={handleClearApiKey}
                                className={styles.clearButton}
                                aria-label="Limpar chave API"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <a
                        href={`https://github.com/settings/personal-access-tokens`}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.linkButton}
                        style={{ fontSize: '14px', color: '#0969da', textDecoration: 'none' }}
                    >
                        {translations[language].getApiKey}
                    </a>

                    <div className={styles.buttonGroup}>
                        <button onClick={handleSearch} className={styles.button} disabled={isSearching}>
                            {isSearching && <span className="spinner" aria-hidden="true" style={{ marginRight: 8 }} />}
                            {isSearching ? translations[language].searching : translations[language].search}
                        </button>
                        <button
                            type="button"
                            onClick={handleUnfollowAllClick}
                            className={styles.button}
                            disabled={isUnfollowingAny || nonFollowers.length === 0}
                        >
                            {isUnfollowingAny && <span className="spinner" aria-hidden="true" style={{ marginRight: 8 }} />}
                            {isUnfollowingAny
                                ? translations[language].unfollowingAll
                                : translations[language].unfollowAll}
                        </button>
                        <button
                            type="button"
                            onClick={handleFollowAllClick}
                            className={styles.button}
                            disabled={isFollowingAny || nonFollowing.length === 0}
                        >
                            {isFollowingAny && <span className="spinner" aria-hidden="true" style={{ marginRight: 8 }} />}
                            {isFollowingAny
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
                                    isUnfollowing={isUnfollowingUser(user.login)}
                                    isFollowing={isFollowingUser(user.login)}
                                    hasUnfollowed={unfollowedUsers.includes(user.login)}
                                    isCurrentlyFollowing={!unfollowedUsers.includes(user.login)}
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
                                    onUnfollow={() => { }}
                                    onFollow={handleFollowClick}
                                    isUnfollowing={false}
                                    isFollowing={isFollowingUser(user.login)}
                                    hasUnfollowed={false}
                                    isCurrentlyFollowing={followingUsers.includes(user.login)}
                                    language={language}
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

            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.statItem}>
                        <h4>{translations[language].totalVisitors}</h4>
                        <p className={styles.statValue}>{stats.visitors.toLocaleString()}</p>
                    </div>

                    {stats.lastUsers.length > 0 && (
                        <div className={styles.lastUsersSection}>
                            <h4>{translations[language].lastUsersAnalyzed}</h4>
                            <div className={styles.lastUsersTags}>
                                {stats.lastUsers.map((user, index) => (
                                    <a
                                        key={index}
                                        href={`https://github.com/${user}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={styles.userTag}
                                        title={`View ${user} on GitHub`}
                                    >
                                        <img
                                            src={`https://github.com/${user}.png?size=20`}
                                            alt=""
                                            width="16"
                                            height="16"
                                            className={styles.miniAvatar}
                                        />
                                        {user}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.copyright}>
                    Unfollow Non-Followers &copy; {new Date().getFullYear()}
                </div>
            </footer>
        </div>
    )
}
