import { ReactionDTO } from '@domains/reaction/dto'
import { ReactionType } from '@prisma/client'

export interface ReactionService {
  createReaction: (userId: string, postId: string, reactionType: ReactionType) => Promise<ReactionDTO>
  deleteReaction: (userId: string, postId: string, reactionType: ReactionType) => Promise<void>
  getReaction: (userId: string, postId: string, reactionType: ReactionType) => Promise<ReactionDTO | null>
}
