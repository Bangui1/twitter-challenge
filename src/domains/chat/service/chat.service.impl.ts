import { ChatService } from '@domains/chat/service/chat.service'
import { ChatRepository } from '@domains/chat/repository/chat.repository'
import { UserService } from '@domains/user/service'
import { ChatroomDTO, ExtendedChatroomDTO, MessageDTO } from '@domains/chat/dto'
import { NotFoundException } from '@utils'

export class ChatServiceImpl implements ChatService {
  constructor (private readonly repository: ChatRepository, private readonly userService: UserService) {}

  async findOrCreateChatroom (user1Id: string, user2Id: string): Promise<ChatroomDTO> {
    const user2 = await this.userService.getUser(user1Id, user2Id)
    const chatroom = await this.repository.findChatroomByMembers([user1Id, user2Id])
    if (chatroom) return chatroom
    const user1 = await this.userService.getUser(user2Id, user1Id)
    if (!user1.follows || !user2.follows) throw new NotFoundException('user')
    return await this.repository.createChatroom(user1Id, user2Id)
  }

  async createMessage (userId: string, chatroomId: string, content: string, date: Date): Promise<MessageDTO> {
    return await this.repository.createMessage(userId, chatroomId, content, date)
  }

  async getChatroomMessages (chatroomId: string): Promise<MessageDTO[]> {
    return await this.repository.getChatroomMessages(chatroomId)
  }

  async findChatroomByMembers (userIds: string[]): Promise<ChatroomDTO | null> {
    return await this.repository.findChatroomByMembers(userIds)
  }

  async getChatroomsByUser (userId: string): Promise<ChatroomDTO[]> {
    return await this.repository.getChatroomsByUserId(userId)
  }

  async getChatroom (chatroomId: string): Promise<ExtendedChatroomDTO | null> {
    return await this.repository.getChatroomById(chatroomId)
  }
}
