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
    const post = await this.repository.create(userId, data)
    const urls: string[] = []

    if (data.images) {
      for (const image of data.images) {
        console.log(image)
        const url = await this.userService.getSignedUrl(`post-images/${image}`)
        urls.push(url)
      }
    }
    return { ...post, images: urls }
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
      const imageUrls = post.images.map(image => this.userService.addBucketUrl(`post-images/${image}`))
      return { ...post, images: imageUrls }
    } else throw new NotFoundException('post')
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    const posts = await this.repository.getAllByDatePaginated(options, userId)
    const imageUrls = posts.map(post => post.images.map(image => this.userService.addBucketUrl(`post-images/${image}`)))
    return posts.map((post, index) => ({ ...post, images: imageUrls[index] }))
  }

  async getPostsByAuthor (userId: any, authorId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    if (await this.userService.userCanAccess(userId, authorId)) {
      const posts = await this.repository.getByAuthorId(options, authorId)
      const imageUrls = posts.map(post => post.images.map(image => this.userService.addBucketUrl(`post-images/${image}`)))
      return posts.map((post, index) => ({ ...post, images: imageUrls[index] }))
    } else throw new NotFoundException('post')
  }

  async createComment (userId: string, parentPostId: string, data: CreatePostInputDTO): Promise<CommentDTO> {
    await validate(data)
    const post = await this.repository.getById(parentPostId)
    if (!post) throw new NotFoundException('post')
    await this.userService.userCanAccess(userId, post.authorId)
    const comment = await this.repository.createComment(userId, parentPostId, data)
    const imageUrls = comment.images.map(image => this.userService.addBucketUrl(`post-images/${image}`))
    return { ...comment, images: imageUrls }
  }

  async getCommentsByPostId (postId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.repository.getCommentsByPostId(options, postId)
    const imageUrls = posts.map(post => post.images.map(image => this.userService.addBucketUrl(`post-images/${image}`)))
    return posts.map((post, index) => ({ ...post, images: imageUrls[index] }))
  }

  async getCommentsByAuthor (userId: string, authorId: string): Promise<CommentDTO[]> {
    if (await this.userService.userCanAccess(userId, authorId)) {
      const comments = await this.repository.getCommentsByUserId(authorId)
      const imageUrls = comments.map(comment => comment.images.map(image => this.userService.addBucketUrl(`post-images/${image}`)))
      return comments.map((comment, index) => ({ ...comment, images: imageUrls[index] }))
    } else throw new NotFoundException('post')
  }

  async getFollowingPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    const posts = await this.repository.getFollowingPosts(options, userId)
    const imageUrls = posts.map(post => post.images.map(image => this.userService.addBucketUrl(`post-images/${image}`)))
    return posts.map((post, index) => ({ ...post, images: imageUrls[index] }))
  }
}
