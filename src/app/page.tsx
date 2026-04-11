"use client"

import { useEffect, useMemo, useState } from 'react'
import ConfirmationModal from './components/Modal/ConfirmationModal'
import Modal from './components/Modal/Modal'
import CredentialsAndActions from './components/CredentialsAndActions/CredentialsAndActions'
import StatsFooter from './components/StatsFooter/StatsFooter'
import TopControls from './components/TopControls/TopControls'
import { UserCard } from './components/UserCard/UserCard'
import { SupportedLanguages, translations } from './constants/translations'
import { useGitHubOperations } from './hooks/useGitHubOperations'
import styles from './page.module.css'
import { GitHubServiceImpl } from './services/GitHubService'
import { DEFAULT_STATS, StatsData, toStatsResponse } from './utils/statsContract'

export default function HomePage() {
    const [username, setUsername] = useState(() => {
        try {
            return localStorage.getItem('githubUsername') || ''
        } catch {
            return ''
        }
    })
    const [apiKey, setApiKey] = useState(() => {
        try {
            const shouldRemember = localStorage.getItem('rememberGithubApiKey') === 'true'
            return shouldRemember ? localStorage.getItem('githubApiKey') || '' : ''
        } catch {
            return ''
        }
    })
    const [rememberApiKey, setRememberApiKey] = useState(() => {
        try {
            return localStorage.getItem('rememberGithubApiKey') === 'true'
        } catch {
            return false
        }
    })
    const [showApiKey, setShowApiKey] = useState(false);
    const [language, setLanguage] = useState<SupportedLanguages>("pt");
    const [primaryVariant, setPrimaryVariant] = useState<'success' | 'violet'>(() => {
        try { return (localStorage.getItem('primaryVariant') as 'success' | 'violet') || 'success' } catch { return 'success' }
    });
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
    const [onConfirm, setOnConfirm] = useState<(() => Promise<void>) | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        try {
            const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
            if (storedTheme) {
                return storedTheme
            }

            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } catch {
            return 'light'
        }
    })
    const [stats, setStats] = useState<StatsData>(DEFAULT_STATS)

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

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
    }

    const refreshStats=async (requestInit?: RequestInit) => {
        try {
            const response=await fetch('/api/stats',requestInit)
            const data=await response.json() as unknown
            const parsed=toStatsResponse(data)
            setStats({visitors: parsed.visitors,lastUsers: parsed.lastUsers})
        } catch {
            setStats(DEFAULT_STATS)
        }
    }

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void refreshStats()
        }, 0)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [])

    // Atualizar o localStorage sempre que o nome do usuário ou a chave da API mudar
    useEffect(() => {
        if (username) {
            localStorage.setItem("githubUsername", username)
        }
    }, [username])

    useEffect(() => {
        if (!rememberApiKey) {
            localStorage.removeItem("githubApiKey")
            return
        }

        if (apiKey) {
            localStorage.setItem("githubApiKey", apiKey)
        } else {
            localStorage.removeItem("githubApiKey")
        }
    }, [apiKey, rememberApiKey])

    useEffect(() => {
        localStorage.setItem('rememberGithubApiKey', String(rememberApiKey))
    }, [rememberApiKey])

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
            void refreshStats({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            })
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
                        message={modalMessage}
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
                    <TopControls
                        theme={theme}
                        onToggleTheme={toggleTheme}
                        primaryVariant={primaryVariant}
                        onPrimaryVariantChange={setPrimaryVariant}
                        language={language}
                        onLanguageChange={setLanguage}
                    />

                    <CredentialsAndActions
                        language={language}
                        username={username}
                        apiKey={apiKey}
                        showApiKey={showApiKey}
                        rememberApiKey={rememberApiKey}
                        isSearching={isSearching}
                        isUnfollowingAny={isUnfollowingAny}
                        isFollowingAny={isFollowingAny}
                        nonFollowersCount={nonFollowers.length}
                        nonFollowingCount={nonFollowing.length}
                        onUsernameChange={setUsername}
                        onApiKeyChange={setApiKey}
                        onRememberApiKeyChange={setRememberApiKey}
                        onToggleApiKeyVisibility={() => setShowApiKey(v => !v)}
                        onClearUsername={handleClearUsername}
                        onClearApiKey={handleClearApiKey}
                        onSearch={handleSearch}
                        onUnfollowAll={handleUnfollowAllClick}
                        onFollowAll={handleFollowAllClick}
                    />
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

            <StatsFooter language={language} stats={stats} />
        </div>
    )
}
