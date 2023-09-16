export class ReactionDTO {
  constructor (reaction: ReactionDTO) {
    this.id = reaction.id
    this.userId = reaction.userId
    this.postId = reaction.postId
    this.reactionType = reaction.reactionType
  }

  id!: string
  userId!: string
  postId!: string
  reactionType!: string
}
