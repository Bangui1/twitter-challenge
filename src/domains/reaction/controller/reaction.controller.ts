import { Request, Response, Router } from 'express'
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import { db } from '@utils'
import HttpStatus from 'http-status'
import { PostServiceImpl } from '@domains/post/service'
import { FollowerServiceImpl } from '@domains/follower/service'
import { UserServiceImpl } from '@domains/user/service'
import { PostRepositoryImpl } from '@domains/post/repository'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { UserRepositoryImpl } from '@domains/user/repository'

export const reactionRouter = Router()

const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db),
  new PostServiceImpl(new PostRepositoryImpl(db), new FollowerServiceImpl(new FollowerRepositoryImpl(db), new UserServiceImpl(new UserRepositoryImpl(db))))
  , new UserServiceImpl(new UserRepositoryImpl(db)))

reactionRouter.post('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { reactionType } = req.body

  const reaction = await service.createReaction(userId, postId, reactionType)

  return res.status(HttpStatus.CREATED).json(reaction)
})

reactionRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params
  const { reactionType } = req.body

  await service.deleteReaction(userId, postId, reactionType)

  return res.status(HttpStatus.OK).send(`deleted reaction for post ${postId}`)
})

reactionRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { reactionType } = req.body
  const { userId: requesterId } = res.locals.context

  const reactions = await service.getReactionsByUser(requesterId, userId, reactionType)

  return res.status(HttpStatus.OK).json(reactions)
})
