import { SupportedLanguages, translations } from '@/app/constants/translations'
import styles from '@/app/page.module.css'

type CredentialsAndActionsProps = {
    language: SupportedLanguages
    username: string
    apiKey: string
    showApiKey: boolean
    rememberApiKey: boolean
    isSearching: boolean
    isUnfollowingAny: boolean
    isFollowingAny: boolean
    nonFollowersCount: number
    nonFollowingCount: number
    onUsernameChange: (value: string) => void
    onApiKeyChange: (value: string) => void
    onRememberApiKeyChange: (value: boolean) => void
    onToggleApiKeyVisibility: () => void
    onClearUsername: () => void
    onClearApiKey: () => void
    onSearch: () => void
    onUnfollowAll: () => void
    onFollowAll: () => void
}

export default function CredentialsAndActions({
    language,
    username,
    apiKey,
    showApiKey,
    rememberApiKey,
    isSearching,
    isUnfollowingAny,
    isFollowingAny,
    nonFollowersCount,
    nonFollowingCount,
    onUsernameChange,
    onApiKeyChange,
    onRememberApiKeyChange,
    onToggleApiKeyVisibility,
    onClearUsername,
    onClearApiKey,
    onSearch,
    onUnfollowAll,
    onFollowAll,
}: CredentialsAndActionsProps) {
    return (
        <>
            <div className={styles.inputContainer}>
                <div className={styles.inputGroup}>
                    <label htmlFor="username-input" className="sr-only">{translations[language].githubUsername}</label>
                    <input
                        id="username-input"
                        type="text"
                        placeholder={translations[language].githubUsername}
                        value={username}
                        onChange={(e) => onUsernameChange(e.target.value)}
                        className={styles.input}
                    />
                    <button
                        type="button"
                        id="clear-username-button"
                        onClick={onClearUsername}
                        className={styles.clearButton}
                    >
                        ✕
                    </button>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="api-key-input" className="sr-only">{translations[language].githubApiKey}</label>
                    <input
                        id="api-key-input"
                        type={showApiKey ? 'text' : 'password'}
                        placeholder={translations[language].githubApiKey}
                        value={apiKey}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                        className={styles.input}
                        autoComplete="current-password"
                    />
                    <button
                        type="button"
                        aria-label={showApiKey ? 'Ocultar chave' : 'Mostrar chave'}
                        onClick={onToggleApiKeyVisibility}
                        className={styles.toggleButton}
                        title={showApiKey ? 'Ocultar' : 'Mostrar'}
                    >
                        {showApiKey ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                        )}
                    </button>
                    <button
                        type="button"
                        id="clear-api-key-button"
                        onClick={onClearApiKey}
                        className={styles.clearButton}
                        aria-label="Limpar chave API"
                    >
                        ✕
                    </button>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                    <input
                        id="remember-api-key-checkbox"
                        type="checkbox"
                        checked={rememberApiKey}
                        onChange={(e) => onRememberApiKeyChange(e.target.checked)}
                    />
                    {translations[language].rememberToken}
                </label>
            </div>

            <a
                href={translations[language].externalLinks.personalAccessTokens}
                target="_blank"
                rel="noreferrer"
                className={styles.linkButton}
                style={{ fontSize: '14px', color: '#0969da', textDecoration: 'none' }}
            >
                {translations[language].getApiKey}
            </a>

            <div className={styles.buttonGroup}>
                <button onClick={onSearch} className={styles.button} disabled={isSearching}>
                    {isSearching && <span className="spinner" aria-hidden="true" style={{ marginRight: 8 }} />}
                    {isSearching ? translations[language].searching : translations[language].search}
                </button>
                <button
                    type="button"
                    onClick={onUnfollowAll}
                    className={styles.button}
                    disabled={isUnfollowingAny || nonFollowersCount === 0}
                >
                    {isUnfollowingAny && <span className="spinner" aria-hidden="true" style={{ marginRight: 8 }} />}
                    {isUnfollowingAny
                        ? translations[language].unfollowingAll
                        : translations[language].unfollowAll}
                </button>
                <button
                    type="button"
                    onClick={onFollowAll}
                    className={styles.button}
                    disabled={isFollowingAny || nonFollowingCount === 0}
                >
                    {isFollowingAny && <span className="spinner" aria-hidden="true" style={{ marginRight: 8 }} />}
                    {isFollowingAny
                        ? translations[language].followingAll
                        : translations[language].followAll}
                </button>
            </div>
        </>
    )
}
