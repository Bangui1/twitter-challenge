import { ReactionServiceImpl } from '../../src/domains/reaction/service';
import { ConflictException, NotFoundException } from '../../src/utils';

const mockReactionRepository = {
  create: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getReactionsByUserId: jest.fn()
}

const mockPostService = {
  getPost: jest.fn(),
  getPostsByAuthor: jest.fn(),
  getLatestPosts: jest.fn(),
  getCommentsByPostId: jest.fn(),
  createPost: jest.fn(),
  deletePost: jest.fn(),
  createComment: jest.fn(),
  getCommentsByAuthor: jest.fn()
}

const mockUserService = {
  deleteUser: jest.fn(),
  getUser: jest.fn(),
  getUserRecommendations: jest.fn(),
  setUserPrivacy: jest.fn(),
  userCanAccess: jest.fn(),
  searchUsers: jest.fn(),
  updateProfilePicture: jest.fn()
}

const reactionService = new ReactionServiceImpl(mockReactionRepository, mockPostService, mockUserService)

describe('ReactionService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates reaction', async () => {
    mockReactionRepository.create.mockResolvedValueOnce(null)
    const result = await reactionService.createReaction('userId', 'postId', 'LIKE')
    expect(mockReactionRepository.getById).toHaveBeenCalledWith('userId', 'postId', 'LIKE')
    expect(mockReactionRepository.create).toHaveBeenCalledWith('userId', 'postId', 'LIKE')
  })

  it('throws error when reaction already exists', async () => {
    mockReactionRepository.getById.mockResolvedValueOnce({} )
    await expect(reactionService.createReaction('userId', 'postId', 'LIKE')).rejects.toThrowError(ConflictException)
  })

  it('deletes reaction', async () => {
    mockReactionRepository.getById.mockResolvedValueOnce({})
    await reactionService.deleteReaction('userId', 'postId', 'LIKE')
    expect(mockReactionRepository.getById).toHaveBeenCalledWith('userId', 'postId', 'LIKE')
    expect(mockReactionRepository.delete).toHaveBeenCalled()
  })

  it('throws error when reaction does not exist trying to delete', async () => {
    mockReactionRepository.getById.mockResolvedValueOnce(null)
    await expect(reactionService.deleteReaction('userId', 'postId', 'LIKE')).rejects.toThrowError(NotFoundException)
  })

  it('gets reaction', async () => {
    mockReactionRepository.getById.mockResolvedValueOnce({})
    await reactionService.getReaction('userId', 'postId', 'LIKE')
    expect(mockReactionRepository.getById).toHaveBeenCalledWith('userId', 'postId', 'LIKE')
  })

  it('return null when not found', async () => {
    mockReactionRepository.getById.mockResolvedValueOnce(null)
    const result = await reactionService.getReaction('userId', 'postId', 'LIKE')
    expect(result).toBeNull()
  })

})
