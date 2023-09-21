import { CursorPagination } from '@types'
import { CommentDTO, CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination, userId: string) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<ExtendedPostDTO | null>
  getByAuthorId: (authorId: string) => Promise<ExtendedPostDTO[]>
  createComment: (userId: string, parentPostId: string, data: CreatePostInputDTO) => Promise<CommentDTO>
  getCommentsByUserId: (userId: string) => Promise<CommentDTO[]>
}
