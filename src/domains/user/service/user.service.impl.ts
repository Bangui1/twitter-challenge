import { NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any, searchedId: string): Promise<{ user: UserViewDTO, follows: boolean }> {
    const user = await this.repository.getById(userId, searchedId)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async setUserPrivacy (userId: string, privacy: boolean): Promise<UserDTO> {
    return await this.repository.setUserPrivacy(userId, privacy)
  }

  async userCanAccess (userId: string, searchedId: string): Promise<boolean> {
    const user = await this.repository.getUserIfFollowedOrPublic(userId, searchedId)
    if (!user) throw new NotFoundException('user')
    return true
  }

  async searchUsers (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    return await this.repository.getUsersContainingUsername(username, options)
  }
}
