import { ChatroomDTO, ExtendedChatroomDTO, MessageDTO } from '@domains/chat/dto'

export interface ChatService {
  createMessage: (userId: string, chatroomId: string, content: string, date: Date) => Promise<MessageDTO>
  findOrCreateChatroom: (user1Id: string, user2Id: string) => Promise<ChatroomDTO>
  getChatroomMessages: (chatroomId: string) => Promise<MessageDTO[]>
  findChatroomByMembers: (userIds: string[]) => Promise<ChatroomDTO | null>
  getChatroomsByUser: (userId: string) => Promise<ChatroomDTO[]>
  getChatroom: (chatroomId: string) => Promise<ExtendedChatroomDTO | null>
}
