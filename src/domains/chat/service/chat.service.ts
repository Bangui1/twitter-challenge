import { ChatroomDTO, MessageDTO } from '@domains/chat/dto'

export interface ChatService {
  createMessage: (userId: string, chatroomId: string, content: string) => Promise<MessageDTO>
  findOrCreateChatroom: (user1Id: string, user2Id: string) => Promise<ChatroomDTO>
  getChatroomMessages: (chatroomId: string) => Promise<MessageDTO[]>
  findChatroomByMembers: (userIds: string[]) => Promise<ChatroomDTO | null>
  getChatroomsByUser: (userId: string) => Promise<ChatroomDTO[]>
}
