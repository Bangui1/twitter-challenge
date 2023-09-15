import { CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { FollowerService } from '@domains/follower/service'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository, private readonly followerService: FollowerService) {}

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    // TODO: validate that the author has public profile or the user follows the author
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.author.private) {
      const follow = await this.followerService.getFollow(userId, post.authorId)
      if (!follow) throw new NotFoundException('post')
    }
    return post
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    return await this.repository.getAllByDatePaginated(options, userId)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    const posts = await this.repository.getByAuthorId(authorId)
    if (posts[0].author.private) {
      const follow = await this.followerService.getFollow(userId, authorId)
      if (!follow) throw new NotFoundException('posts')
    }
    return posts
  }
}
