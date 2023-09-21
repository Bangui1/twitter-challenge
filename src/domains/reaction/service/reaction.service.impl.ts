import { ReactionService } from '@domains/reaction/service/reaction.service'
import { ReactionDTO } from '@domains/reaction/dto'
import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { ReactionType } from '@prisma/client'
import { ConflictException, NotFoundException } from '@utils'
import { PostService } from '@domains/post/service'
import { FollowerService } from '@domains/follower/service'
import { UserService } from '@domains/user/service'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository, private readonly postService: PostService, private readonly userService: UserService) {}
  async createReaction (userId: string, postId: string, reactionType: ReactionType): Promise<ReactionDTO> {
    const reaction = await this.repository.getById(userId, postId, reactionType)

    if (reaction) throw new ConflictException('REACTION_ALREADY_EXISTS')

    return await this.repository.create(userId, postId, reactionType)
  }

  async deleteReaction (userId: string, postId: string, reactionType: ReactionType): Promise<void> {
    const reaction = await this.repository.getById(userId, postId, reactionType)

    if (!reaction) throw new NotFoundException('reaction')

    await this.repository.delete(reaction.id)
  }

  async getReaction (userId: string, postId: string, reactionType: ReactionType): Promise<ReactionDTO | null> {
    await this.postService.getPost(userId, postId)
    return await this.repository.getById(userId, postId, reactionType)
  }

  async getReactionsByUser (userId: string, searchedId: string, reactionType: ReactionType): Promise<ReactionDTO[]> {
    await this.userService.userCanAccess(userId, searchedId)
    return await this.repository.getReactionsByUserId(searchedId, reactionType)
  }
}
