import { OffsetPagination } from '@types'
import { UserDTO, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  setUserPrivacy: (userId: string, privacy: boolean) => Promise<UserDTO>
  userCanAccess: (userId: string, searchedId: string) => Promise<boolean>
}
