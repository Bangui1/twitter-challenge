import { ArrayMaxSize, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { ExtendedUserDTO, UserViewDTO } from '@domains/user/dto'
import { ReactionDTO } from '@domains/reaction/dto'

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsOptional()
  @ArrayMaxSize(4)
    images?: string[]

  @IsOptional()
    parentPostId?: string
}

export class PostDTO {
  constructor (post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.content = post.content
    this.images = post.images
    this.createdAt = post.createdAt
  }

  id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
}

export class ExtendedPostDTO extends PostDTO {
  constructor (post: ExtendedPostDTO) {
    super(post)
    this.author = new UserViewDTO(post.author)
    this.qtyComments = post.qtyComments
    this.reactions = post.reactions
    this.parentPostId = post.parentPostId
    this.qtyLikes = post.qtyLikes
    this.qtyRetweets = post.qtyRetweets
  }

  author!: UserViewDTO
  qtyComments!: number
  reactions!: ReactionDTO[]
  qtyLikes!: number
  qtyRetweets!: number
  parentPostId: string | null
}

export class CommentDTO extends PostDTO {
  constructor (comment: CommentDTO) {
    super(comment)
    this.parentPost = comment.parentPost
  }

  parentPost: PostDTO | null
}
