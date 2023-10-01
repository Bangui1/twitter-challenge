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

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     tags: [User]
 *     summary: Get user recommendations
 *     description: Retrieve a list of user recommendations based on the authenticated user's preferences.
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: The maximum number of recommendations to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: skip
 *         in: query
 *         description: The number of recommendations to skip before starting to retrieve recommendations.
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserViewDTO'
 *       '401':
 *         description: Unauthorized - User not authenticated
 *       '500':
 *         description: Internal Server Error
 */
userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     tags: [User]
 *     summary: Get authenticated user's information
 *     description: Retrieve information about the authenticated user.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserViewDTO'
 *       '401':
 *         description: Unauthorized - User not authenticated
 *       '404':
 *         description: User not found
 */
userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId, userId)

  return res.status(HttpStatus.OK).json(user)
})

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by ID
 *     description: Retrieve a user's information by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         type: integer
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserViewDTO'
 *       '404':
 *         description: User not found
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: searchedUser } = req.params

  const user = await service.getUser(userId, searchedUser)

  return res.status(HttpStatus.OK).json(user)
})

/**
 * @swagger
 * /api/user:
 *   delete:
 *     tags: [User]
 *     summary: Delete the authenticated user
 *     description: Delete the authenticated user's account.
 *     responses:
 *       '200':
 *         description: Successful response
 *       '401':
 *         description: Unauthorized - User not authenticated
 *       '500':
 *         description: Internal Server Error
 */
userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

/**
 * @swagger
 * /api/user/me:
 *   patch:
 *     tags: [User]
 *     summary: Update authenticated user's privacy settings
 *     description: Update the privacy settings of the authenticated user's account.
 *     parameters:
 *       - name: privacy
 *         in: query
 *         description: New privacy setting (true for private, false for public).
 *         required: true
 *         schema:
 *           type: boolean
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *       '401':
 *         description: Unauthorized - User not authenticated
 *       '500':
 *         description: Internal Server Error
 */
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

/**
 * @swagger
 * /api/user/by_username/{username}:
 *   get:
 *     tags: [User]
 *     summary: Search users by username
 *     description: Retrieve a list of users whose usernames contain a specified keyword.
 *     parameters:
 *       - name: username
 *         in: path
 *         description: The keyword to search for in usernames.
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         description: The maximum number of users to retrieve.
 *         required: false
 *         schema:
 *           type: integer
 *       - name: before
 *         in: query
 *         description: Get users before a specific cursor.
 *         required: false
 *         schema:
 *           type: string
 *       - name: after
 *         in: query
 *         description: Get users after a specific cursor.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserViewDTO'
 *       '401':
 *         description: Unauthorized - User not authenticated
 *       '500':
 *         description: Internal Server Error
 */
userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { username } = req.params
  const { limit, before, after } = req.query as Record<string, string>

  const user = await service.searchUsers(username, { limit: Number(limit), before, after })

  return res.status(HttpStatus.OK).json(user)
})
