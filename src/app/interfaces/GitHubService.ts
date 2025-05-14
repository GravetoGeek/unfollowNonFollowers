import {SupportedLanguages} from '../constants/translations'
import {User} from './User'

export interface GitHubService {
    fetchAllPages<T>(url: string, token: string, language: SupportedLanguages): Promise<T[]>
    fetchNonFollowers(username: string, token: string, language: SupportedLanguages): Promise<User[]>
    fetchNonFollowing(username: string, token: string, language: SupportedLanguages): Promise<User[]>
    unfollowUser(usernameToUnfollow: string, token: string, language: SupportedLanguages): Promise<boolean>
    followUser(usernameToFollow: string, token: string, language: SupportedLanguages): Promise<boolean>
}
