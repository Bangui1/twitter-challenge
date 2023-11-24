import { FollowerServiceImpl } from '../../src/domains/follower/service';
import { ConflictException, NotFoundException } from '../../src/utils';

const mockRepository ={
  create: jest.fn(),
  delete: jest.fn(),
  getById: jest.fn(),
  getFollowersByUserId: jest.fn(),
  getFollowsByUserId: jest.fn(),
}

const mockUserService = {
  deleteUser: jest.fn(),
  getUser: jest.fn(),
  getUserRecommendations: jest.fn(),
  setUserPrivacy: jest.fn(),
  userCanAccess: jest.fn(),
  searchUsers: jest.fn(),
  updateProfilePicture: jest.fn(),
  getSignedUrl: jest.fn(),
  addBucketUrl: jest.fn(),
}

const service = new FollowerServiceImpl(mockRepository, mockUserService)

describe('FollowerService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('creates follow', async () => {
    mockRepository.create.mockResolvedValueOnce(null)
    await service.createFollow('followerId', 'followedId')
    expect(mockRepository.getById).toHaveBeenCalledWith('followerId', 'followedId')
    expect(mockRepository.create).toHaveBeenCalledWith('followerId', 'followedId')
  })

  it('throws error when follow already exists', async () => {
    mockRepository.getById.mockResolvedValueOnce({})
    await expect(service.createFollow('followerId', 'followedId')).rejects.toThrowError(ConflictException)
  })

  it('deletes follow', async () => {
    mockRepository.getById.mockResolvedValueOnce({})
    await service.deleteFollow('followerId', 'followedId')
    expect(mockRepository.getById).toHaveBeenCalledWith('followerId', 'followedId')
    expect(mockRepository.delete).toHaveBeenCalled()
  })

  it('throws error when follow does not exist trying to delete', async () => {
    mockRepository.getById.mockResolvedValueOnce(null)
    await expect(service.deleteFollow('followerId', 'followedId')).rejects.toThrowError(NotFoundException)
  })
})
