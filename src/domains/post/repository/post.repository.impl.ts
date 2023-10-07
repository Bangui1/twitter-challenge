import { Post, PrismaClient, ReactionType } from '@prisma/client'

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

  async getAllByDatePaginated (options: CursorPagination, userId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        parentPostId: null,
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
      include: {
        author: true,
        reactions: true,
        _count: {
          select: {
            comments: true
          }
        }
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
    return posts.map(post => {
      const qtyLikes = post.reactions.filter(reaction => reaction.reactionType === ReactionType.LIKE).length
      const qtyRetweets = post.reactions.filter(reaction => reaction.reactionType === ReactionType.RETWEET).length
      return new ExtendedPostDTO({
        ...post,
        qtyComments: post._count.comments,
        qtyLikes,
        qtyRetweets
      })
    })
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
        author: true,
        _count: {
          select: {
            comments: true
          }
        },
        reactions: true
      }
    })
    if (!post) return null
    const qtyLikes = post.reactions.filter(reaction => reaction.reactionType === ReactionType.LIKE).length
    const qtyRetweets = post.reactions.filter(reaction => reaction.reactionType === ReactionType.RETWEET).length
    return new ExtendedPostDTO({
      ...post,
      qtyComments: post._count.comments,
      qtyLikes,
      qtyRetweets
    })
  }

  async getByAuthorId (authorId: string): Promise<ExtendedPostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      },
      include: {
        author: true,
        _count: {
          select: {
            comments: true
          }
        },
        reactions: true
      }
    })
    return posts.map(post => {
      const qtyLikes = post.reactions.filter(reaction => reaction.reactionType === ReactionType.LIKE).length
      const qtyRetweets = post.reactions.filter(reaction => reaction.reactionType === ReactionType.RETWEET).length
      return new ExtendedPostDTO({
        ...post,
        qtyComments: post._count.comments,
        qtyLikes,
        qtyRetweets
      })
    })
  }

  async createComment (userId: string, parentPostId: string, data: CreatePostInputDTO): Promise<CommentDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        parentPostId,
        ...data
      },
      include: {
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

  async getCommentsByPostId (options: CursorPagination, postId: string): Promise<ExtendedPostDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        parentPostId: postId
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          reactions: {
            _count: 'desc'
          }
        },
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ],
      include: {
        _count: {
          select: {
            comments: true
          }
        },
        reactions: true,
        author: true
      }
    })
    return comments.map(comment => {
      const qtyLikes = comment.reactions.filter(reaction => reaction.reactionType === ReactionType.LIKE).length
      const qtyRetweets = comment.reactions.filter(reaction => reaction.reactionType === ReactionType.RETWEET).length
      return new ExtendedPostDTO({
        ...comment,
        qtyComments: comment._count.comments,
        qtyLikes,
        qtyRetweets
      })
    })
  }
}
