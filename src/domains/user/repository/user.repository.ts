import { SignupInputDTO } from '@domains/auth/dto'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination, userId: string) => Promise<UserViewDTO[]>
  getById: (userId: string, searchedId: string) => Promise<{ user: UserViewDTO, follows: boolean } | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  setUserPrivacy: (userId: string, privacy: boolean) => Promise<UserDTO>
  getUserIfFollowedOrPublic: (userId: string, searchedId: string) => Promise<UserDTO | null>
  getUsersContainingUsername: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
  updateProfilePicture: (userId: string, picture: string) => Promise<UserViewDTO>
}
