import { FollowerRepository } from './follower.repository'
import { PrismaClient } from '@prisma/client'
import { FollowDto } from '@domains/follower/dto'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (followerId: string, followedId: string): Promise<void> {
    await this.db.follow.create({
      data: {
        followerId,
        followedId
      }
    })
  }

  async delete (followId: string): Promise<void> {
    await this.db.follow.delete({
      where: {
        id: followId
      }
    })
  }

  async getById (followerId: string, followedId: string): Promise<FollowDto | null> {
    const follow = await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    })
    return follow ? new FollowDto(follow) : null
  }

  async getFollowersByUserId (userId: string): Promise<FollowDto[]> {
    const follows = await this.db.follow.findMany({
      where: {
        followedId: userId
      }
    })
    return follows.map(follow => new FollowDto(follow))
  }

  async getFollowsByUserId (userId: string): Promise<FollowDto[]> {
    const follows = await this.db.follow.findMany({
      where: {
        followerId: userId
      }
    })
    return follows.map(follow => new FollowDto(follow))
  }
}
