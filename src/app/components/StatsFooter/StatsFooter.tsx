import Image from 'next/image'
import { SupportedLanguages, translations } from '@/app/constants/translations'
import styles from '@/app/page.module.css'
import { StatsData } from '@/app/utils/statsContract'

type StatsFooterProps = {
    language: SupportedLanguages
    stats: StatsData
}

export default function StatsFooter({ language, stats }: StatsFooterProps) {
    const safeVisitors = typeof stats?.visitors === 'number' && Number.isFinite(stats.visitors)
        ? stats.visitors
        : 0

    const safeLastUsers = Array.isArray(stats?.lastUsers)
        ? stats.lastUsers.filter((user): user is string => typeof user === 'string').slice(0, 10)
        : []

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.statItem}>
                    <h4>{translations[language].totalVisitors}</h4>
                    <p className={styles.statValue}>{safeVisitors.toLocaleString()}</p>
                </div>

                {safeLastUsers.length > 0 && (
                    <div className={styles.lastUsersSection}>
                        <h4>{translations[language].lastUsersAnalyzed}</h4>
                        <div className={styles.lastUsersTags}>
                            {safeLastUsers.map((user, index) => (
                                <a
                                    key={index}
                                    href={`https://github.com/${user}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={styles.userTag}
                                    title={`View ${user} on GitHub`}
                                >
                                    <Image
                                        src={`https://avatars.githubusercontent.com/${user}?size=20`}
                                        alt={`${user} avatar`}
                                        width={16}
                                        height={16}
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
    )
}
