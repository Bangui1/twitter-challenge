import { NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Constants, s3Client } from '@utils'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any, searchedId: string): Promise<{ user: UserViewDTO, follows: boolean }> {
    const user = await this.repository.getById(userId, searchedId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options, userId)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async setUserPrivacy (userId: string, privacy: boolean): Promise<UserDTO> {
    return await this.repository.setUserPrivacy(userId, privacy)
  }

  async userCanAccess (userId: string, searchedId: string): Promise<boolean> {
    if (userId === searchedId) return true
    const user = await this.repository.getUserIfFollowedOrPublic(userId, searchedId)
    if (!user) throw new NotFoundException('user')
    return true
  }

  async searchUsers (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    return await this.repository.getUsersContainingUsername(username, options)
  }

  async updateProfilePicture (userId: string, picture: string): Promise<UserViewDTO> {
    return await this.repository.updateProfilePicture(userId, picture)
  }

  async getSignedUrl (fileName: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: 'multipart/form-data'
    })

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  }

  addBucketUrl (fileName: string): string {
    return `https://${Constants.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`
  }
}
