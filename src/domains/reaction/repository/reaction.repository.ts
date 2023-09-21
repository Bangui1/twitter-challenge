import { ReactionType } from '@prisma/client'
import { ReactionDTO } from '@domains/reaction/dto'

export interface ReactionRepository {
  create: (userId: string, postId: string, type: ReactionType) => Promise<ReactionDTO>
  getById: (userId: string, postId: string, type: ReactionType) => Promise<ReactionDTO | null>
  delete: (reactionId: string) => Promise<void>
  getReactionsByUserId: (userId: string, type: ReactionType) => Promise<ReactionDTO[]>
}
