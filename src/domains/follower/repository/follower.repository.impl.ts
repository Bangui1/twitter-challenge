import { FollowerRepository } from "./follower.repository";
import { Follow, PrismaClient } from "@prisma/client";


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

  async getById (followerId: string, followedId: string): Promise<Follow | null> {
    return await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      },
    })
  }
}