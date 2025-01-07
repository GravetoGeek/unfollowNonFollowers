import {Module} from '@nestjs/common';
import {GitHubController} from './github/github.controller';
import {GitHubService} from './github/github.service';

@Module({
    imports: [],
    controllers: [GitHubController],
    providers: [GitHubService],
})
export class AppModule {}
