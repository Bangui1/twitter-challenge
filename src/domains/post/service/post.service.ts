import { CommentDTO, CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { CursorPagination } from '@types'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<PostDTO>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string, options: CursorPagination) => Promise<PostDTO[]>
  createComment: (userId: string, parentPostId: string, body: CreatePostInputDTO) => Promise<CommentDTO>
  getCommentsByPostId: (postId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
  getCommentsByAuthor: (userId: string, authorId: string) => Promise<CommentDTO[]>
  getFollowingPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
}
