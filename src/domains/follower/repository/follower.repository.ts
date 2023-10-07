import { FollowDto } from '@domains/follower/dto'

export interface FollowerRepository {
  create: (followerId: string, followedId: string) => Promise<void>
  delete: (followId: string) => Promise<void>
  getById: (followerId: string, followedId: string) => Promise<FollowDto | null>
  getFollowersByUserId: (userId: string) => Promise<FollowDto[]>
  getFollowsByUserId: (userId: string) => Promise<FollowDto[]>
}
