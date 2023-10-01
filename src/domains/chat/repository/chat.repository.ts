import { ChatroomDTO, MessageDTO } from '@domains/chat/dto'

export interface ChatRepository {
  createMessage: (userId: string, chatroomId: string, content: string) => Promise<MessageDTO>
  createChatroom: (user1Id: string, user2Id: string) => Promise<ChatroomDTO>
  getChatroomMessages: (chatroomId: string) => Promise<MessageDTO[]>
  findChatroomByMembers: (userIds: string[]) => Promise<ChatroomDTO | null>
  getChatroomById: (chatroomId: string) => Promise<ChatroomDTO | null>
  getChatroomsByUserId: (userId: string) => Promise<ChatroomDTO[]>
}
