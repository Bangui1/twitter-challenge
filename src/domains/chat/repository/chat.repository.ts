import { ChatroomDTO, ExtendedChatroomDTO, MessageDTO } from '@domains/chat/dto'

export interface ChatRepository {
  createMessage: (userId: string, chatroomId: string, content: string, date: Date) => Promise<MessageDTO>
  createChatroom: (user1Id: string, user2Id: string) => Promise<ChatroomDTO>
  getChatroomMessages: (chatroomId: string) => Promise<MessageDTO[]>
  findChatroomByMembers: (userIds: string[]) => Promise<ChatroomDTO | null>
  getChatroomById: (chatroomId: string) => Promise<ExtendedChatroomDTO | null>
  getChatroomsByUserId: (userId: string) => Promise<ChatroomDTO[]>
}
