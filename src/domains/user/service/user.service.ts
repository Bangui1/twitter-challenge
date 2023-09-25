import { CursorPagination, OffsetPagination } from '@types'
import { UserDTO, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any, searchedId: string) => Promise<{ user: UserViewDTO, follows: boolean }>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  setUserPrivacy: (userId: string, privacy: boolean) => Promise<UserDTO>
  userCanAccess: (userId: string, searchedId: string) => Promise<boolean>
  searchUsers: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
}
