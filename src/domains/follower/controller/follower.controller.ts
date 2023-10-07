import { Request, Response, Router } from 'express'
import { FollowerService, FollowerServiceImpl } from '../service'
import { FollowerRepositoryImpl } from '../repository'
import { db } from '@utils'
import { UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import httpStatus from 'http-status'

export const followerRouter = Router()

const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db), new UserServiceImpl(new UserRepositoryImpl(db)))

followerRouter.post('/follow/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: followedId } = req.params

  await service.createFollow(userId, followedId)

  return res.status(httpStatus.CREATED).send(`Followed user ${followedId}`)
})

followerRouter.post('/unfollow/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: followedId } = req.params

  await service.deleteFollow(userId, followedId)

  return res.status(httpStatus.OK).send(`Unfollowed user ${followedId}`)
})

followerRouter.get('/followers/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const followers = await service.getFollowers(userId)

  return res.status(httpStatus.OK).json(followers)
})

followerRouter.get('/follows/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const follows = await service.getFollows(userId)

  return res.status(httpStatus.OK).json(follows)
})
