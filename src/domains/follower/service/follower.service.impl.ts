import { ConflictException, ForbiddenException, NotFoundException } from "@utils";
import { FollowerRepository } from "../repository";
import { FollowerService } from "./follower.service";
import { UserService } from "@domains/user/service";


export class FollowerServiceImpl implements FollowerService {
    constructor (private readonly repository: FollowerRepository, private readonly userService: UserService) {}

    async createFollow (followerId: string, followedId: string): Promise<void>{
        await this.userService.getUser(followedId);
        const follow = await this.repository.getById(followerId, followedId);
        if(follow) throw new ConflictException('FOLLOW_ALREADY_EXISTS');
        await this.repository.create(followerId, followedId);
    }

    async deleteFollow (followerId: string, followedId: string): Promise<void>{
        const follow : any  = await this.repository.getById(followerId, followedId);
        if(!follow) throw new NotFoundException('follow');
        await this.repository.delete(follow.id);
    }

}