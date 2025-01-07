import {Injectable} from '@nestjs/common';

@Injectable()
export class GitHubService {
    private readonly baseUrl='https://api.github.com';

    async fetchAllPages(url: string,token: string): Promise<{login: string}[]> {
        let results=[];
        let page=1;

        try {
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
            console.error(`Erro ao buscar páginas: ${error.message}`);
            throw new Error('Falha ao obter dados de múltiplas páginas.');
        }

        return results;
    }

    async unfollowNonFollowers(username: string,token: string): Promise<string[]> {
        try {
            const following=await this.fetchAllPages(
                `${this.baseUrl}/users/${username}/following`,
                token,
            );

            const followers=await this.fetchAllPages(
                `${this.baseUrl}/users/${username}/followers`,
                token,
            );

            const followersLogins=followers.map((follower) => follower.login);

            const nonFollowers=following.filter(
                (user) => !followersLogins.includes(user.login),
            );

            const unfollowedUsers: string[]=[];

            for(const user of nonFollowers) {
                const response=await fetch(`${this.baseUrl}/user/following/${user.login}`,{
                    method: 'DELETE',
                    headers: {Authorization: `token ${token}`},
                });

                if(!response.ok) {
                    console.error(`Erro ao deixar de seguir ${user.login}: ${response.status} - ${response.statusText}`);
                    continue;
                }

                unfollowedUsers.push(user.login);
            }

            return unfollowedUsers;
        } catch(error) {
            console.error(`Erro durante a operação de unfollow: ${error.message}`);
            throw new Error('Falha ao executar a operação de unfollow.');
        }
    }
}