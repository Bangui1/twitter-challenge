import { ConflictException, NotFoundException } from '@utils'
import { FollowerRepository } from '../repository'
import { FollowerService } from './follower.service'
import { UserService } from '@domains/user/service'
import { FollowDto } from '../dto'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository, private readonly userService: UserService) {}

  async createFollow (followerId: string, followedId: string): Promise<void> {
    await this.userService.getUser(followedId, followedId)
    const follow = await this.repository.getById(followerId, followedId)
    if (follow) throw new ConflictException('FOLLOW_ALREADY_EXISTS')
    await this.repository.create(followerId, followedId)
  }

  async deleteFollow (followerId: string, followedId: string): Promise<void> {
    const follow = await this.repository.getById(followerId, followedId)
    if (follow === null) throw new NotFoundException('follow')
    await this.repository.delete(follow.id)
  }

  async getFollow (followerId: string, followedId: string): Promise<FollowDto | null> {
    return await this.repository.getById(followerId, followedId)
  }

  async getFollowers (userId: string): Promise<FollowDto[]> {
    return await this.repository.getFollowersByUserId(userId)
  }

  async getFollows (userId: string): Promise<FollowDto[]> {
    return await this.repository.getFollowsByUserId(userId)
  }
}
