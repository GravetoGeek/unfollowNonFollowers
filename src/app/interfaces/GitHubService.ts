import {User} from './User'

export interface GitHubService {
    fetchAllPages<T>(url: string, token: string): Promise<T[]>
    fetchNonFollowers(username: string, token: string): Promise<User[]>
    fetchNonFollowing(username: string, token: string): Promise<User[]>
    unfollowUser(usernameToUnfollow: string, token: string): Promise<boolean>
    followUser(usernameToFollow: string, token: string): Promise<boolean>
}
