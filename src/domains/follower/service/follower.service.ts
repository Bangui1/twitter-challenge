import { FollowDto } from '@domains/follower/dto';

export interface FollowerService {
  createFollow: (followerId: string, followedId: string) => Promise<void>
  deleteFollow: (followerId: string, followedId: string) => Promise<void>
  getFollow: (followerId: string, followedId: string) => Promise<FollowDto | null>
}
