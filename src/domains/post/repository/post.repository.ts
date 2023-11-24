import { CursorPagination } from '@types'
import { CommentDTO, CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination, userId: string) => Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<ExtendedPostDTO | null>
  getByAuthorId: (options: CursorPagination, authorId: string) => Promise<ExtendedPostDTO[]>
  createComment: (userId: string, parentPostId: string, data: CreatePostInputDTO) => Promise<CommentDTO>
  getCommentsByUserId: (userId: string) => Promise<CommentDTO[]>
  getCommentsByPostId: (options: CursorPagination, postId: string) => Promise<ExtendedPostDTO[]>
  getFollowingPosts: (options: CursorPagination, userId: string) => Promise<ExtendedPostDTO[]>
}
