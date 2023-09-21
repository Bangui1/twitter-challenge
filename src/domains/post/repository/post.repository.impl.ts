import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CommentDTO, CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (options: CursorPagination, userId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        OR: [{
          author: {
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
        },
        {
          authorId: userId
        }
        ]
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<ExtendedPostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: true
      }
    })
    return (post != null) ? new ExtendedPostDTO(post) : null
  }

  async getByAuthorId (authorId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      },
      include: {
        author: true
      }
    })
    return posts.map(post => new ExtendedPostDTO(post))
  }

  async createComment (userId: string, parentPostId: string, data: CreatePostInputDTO): Promise<CommentDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        parentPostId,
        ...data
      },
      include: {
        author: true,
        parentPost: true
      }
    })
    return new CommentDTO(post)
  }

  async getCommentsByUserId (userId: string): Promise<CommentDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        authorId: userId,
        parentPostId: { not: null }
      },
      include: {
        author: true,
        parentPost: true
      }
    })
    return comments.map(comment => new CommentDTO(comment))
  }
}
