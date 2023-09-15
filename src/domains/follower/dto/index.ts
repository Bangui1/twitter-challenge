export class FollowDto {
  constructor (follow: FollowDto) {
    this.id = follow.id
    this.followerId = follow.followerId
    this.followedId = follow.followedId
  }

  id!: string
  followerId!: string
  followedId!: string
}
