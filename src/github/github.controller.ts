import {BadRequestException,Body,Controller,Post,Res} from '@nestjs/common';
import {Response} from 'express';
import {GitHubService} from './github.service';

@Controller('')
export class GitHubController {
    constructor(private readonly githubService: GitHubService) {}

    @Post('')
    async unfollowNonFollowers(@Body() body: {username: string; token: string},@Res() res: Response) {
        const {username,token}=body;

        if(!username||!token) {
            throw new BadRequestException('O nome de usuário e o token são obrigatórios.');
        }

        try {
            const unfollowedUsers=await this.githubService.unfollowNonFollowers(
                username,
                token,
            );

            // Retornar status 200 e uma mensagem de sucesso
            return res.status(200).json({
                message: 'Operação unfollow completada.',
                unfollowedUsers,
            })

        } catch(error) {
            console.error(`Erro no controlador: ${error.message}`);
            throw new BadRequestException('Falha ao completar a operação de unfollow.');
        }
    }
}
