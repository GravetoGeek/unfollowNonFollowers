import { SupportedLanguages } from '@/app/constants/translations'
import styles from '@/app/page.module.css'

type TopControlsProps = {
    theme: 'light' | 'dark'
    onToggleTheme: () => void
    primaryVariant: 'success' | 'violet'
    onPrimaryVariantChange: (value: 'success' | 'violet') => void
    language: SupportedLanguages
    onLanguageChange: (value: SupportedLanguages) => void
}

export default function TopControls({
    theme,
    onToggleTheme,
    primaryVariant,
    onPrimaryVariantChange,
    language,
    onLanguageChange,
}: TopControlsProps) {
    return (
        <div className={styles.topControls}>
            <button
                onClick={onToggleTheme}
                className={`${styles.button} ${styles.iconButton}`}
                aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
                {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>)}
            </button>

            <div className={styles.themeSelectorGroup}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label className="sr-only">Tema primário</label>
                    <select
                        value={primaryVariant}
                        onChange={(e) => onPrimaryVariantChange(e.target.value as 'success' | 'violet')}
                        className={`${styles.input} ${styles.halfSelect}`}
                        style={{ width: 'auto' }}
                    >
                        <option value="success">Verde</option>
                        <option value="violet">Roxo</option>
                    </select>
                </div>

                <select
                    id="language-select"
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as SupportedLanguages)}
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
        </div>
    )
}
