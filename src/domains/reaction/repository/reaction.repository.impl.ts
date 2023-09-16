import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { PrismaClient, ReactionType } from '@prisma/client'
import { ReactionDTO } from '@domains/reaction/dto'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}
  async create (userId: string, postId: string, reactionType: ReactionType): Promise<ReactionDTO> {
    return this.db.reaction.create({
      data: {
        userId,
        postId,
        reactionType
      }
    }).then(reaction => new ReactionDTO(reaction))
  }

  async delete (reactionId: string): Promise<void> {
    await this.db.reaction.delete({
      where: {
        id: reactionId
      }
    })
  }

  async getById (userId: string, postId: string, reactionType: ReactionType): Promise<ReactionDTO | null> {
    const reaction = await this.db.reaction.findFirst({
      where: {
        userId,
        postId,
        reactionType
      }
    })
    return reaction ? new ReactionDTO(reaction) : null
  }
}
