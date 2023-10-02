import { CommentDTO, CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'
import { UserService } from '@domains/user/service'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository, private readonly userService: UserService) {}

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
    if (await this.userService.userCanAccess(userId, post.authorId)) {
      return post
    } else throw new NotFoundException('post')
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    return await this.repository.getAllByDatePaginated(options, userId)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    if (await this.userService.userCanAccess(userId, authorId)) {
      return await this.repository.getByAuthorId(authorId)
    } else throw new NotFoundException('post')
  }

  async createComment (userId: string, parentPostId: string, data: CreatePostInputDTO): Promise<CommentDTO> {
    await validate(data)
    const post = await this.repository.getById(parentPostId)
    if (!post) throw new NotFoundException('post')
    return await this.repository.createComment(userId, parentPostId, data)
  }

  async getCommentsByPostId (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    return await this.repository.getCommentsByPostId(options, postId)
  }
}
