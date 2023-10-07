import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getById (userId: string, searchedId: string): Promise<{ user: UserViewDTO, follows: boolean } | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: searchedId
      },
      include: {
        follows: {
          where: {
            followerId: searchedId,
            followedId: userId
          }
        }
      }
    })
    return user ? { user: new UserViewDTO(user), follows: user.follows.length === 1 } : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination, userId: string): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: {
        AND: [
          {
            followers: {
              none: {
                followerId: userId
              },
              some: {
                follower: {
                  followers: {
                    some: {
                      followerId: userId
                    }
                  }
                }
              }
            }
          },
          {
            id: {
              not: userId
            }
          }
        ]
      },
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async setUserPrivacy (userId: string, privacy: boolean): Promise<UserDTO> {
    const user = await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        private: privacy
      }
    })
    return new UserDTO(user)
  }

  async getUserIfFollowedOrPublic (userId: string, searchedId: string): Promise<UserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        id: searchedId,
        OR: [
          {
            followers: {
              some: {
                followerId: userId
              }
            }
          },
          {
            private: false
          }
        ]
      }
    })
    return user ? new UserDTO(user) : null
  }

  async getUsersContainingUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      where: {
        username: {
          contains: username
        }
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
  }

  async updateProfilePicture (userId: string, picture: string): Promise<UserViewDTO> {
    const user = await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: picture
      }
    })
    return new UserViewDTO(user)
  }
}
