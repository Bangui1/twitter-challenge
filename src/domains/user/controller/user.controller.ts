import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
import 'express-async-errors'
import { s3Client } from '@utils/aws.bucket'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params

  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

userRouter.patch('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { privacy } = req.query

  const user = await service.setUserPrivacy(userId, privacy === 'true')

  return res.status(HttpStatus.OK).json(user)
})

userRouter.post('/get-presigned-url', async (req: Request, res: Response) => {
  try {
    const { fileName } = req.body

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: 'multipart/form-data'
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return res.status(HttpStatus.OK).json({ url })
  } catch (error) {
    console.error('Error generating pre-signed URL:', error)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Unable to generate pre-signed URL' })
  }
})

userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { username } = req.params
  const { limit, before, after } = req.query as Record<string, string>

  const user = await service.searchUsers(username, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(user)
})
