import Image from 'next/image'
import {SupportedLanguages,translations} from '../../constants/translations'
import {User} from '../../interfaces/User'
import styles from './UserCard.module.css'

interface UserCardProps {
    user: User
    onUnfollow: (login: string) => void
    onFollow: (login: string) => void
    isUnfollowing: boolean
    isFollowing: boolean
    hasUnfollowed: boolean
    isCurrentlyFollowing: boolean
    language: SupportedLanguages
}

export const UserCard: React.FC<UserCardProps> = ({
    user,
    onUnfollow,
    onFollow,
    isUnfollowing,
    isFollowing,
    hasUnfollowed,
    isCurrentlyFollowing,
    language,
}) => {
    return (
        <li className={styles.listItem}>
            <Image src={user.avatar_url} alt={user.login} width={50} height={50} className={styles.avatar} />
            <div className={styles.userInfo}>
                <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer" className={styles.username}>
                    {user.login}
                </a>
                {isCurrentlyFollowing && !hasUnfollowed && <span>{translations[language].following}</span>}
                {hasUnfollowed && <span>{translations[language].unfollowed}</span>}
            </div>
            <div>
                {!isCurrentlyFollowing && !hasUnfollowed && (
                    <button
                        onClick={() => onFollow(user.login)}
                        className={styles.button}
                        disabled={isFollowing}
                    >
                        {isFollowing ? translations[language].following : translations[language].follow}
                    </button>
                )}
                {isCurrentlyFollowing && !hasUnfollowed && (
                    <button
                        onClick={() => onUnfollow(user.login)}
                        className={styles.button}
                        disabled={isUnfollowing}
                    >
                        {isUnfollowing ? translations[language].unfollowing : translations[language].unfollow}
                    </button>
                )}
            </div>
        </li>
    )
}
