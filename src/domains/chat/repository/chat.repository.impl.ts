import { ChatRepository } from '@domains/chat/repository/chat.repository'
import { PrismaClient } from '@prisma/client'
import { ChatroomDTO, ExtendedChatroomDTO, MessageDTO } from '@domains/chat/dto'

export class ChatRepositoryImpl implements ChatRepository {
  constructor (private readonly db: PrismaClient) {}

  async createMessage (userId: string, chatroomId: string, content: string, date: Date): Promise<MessageDTO> {
    const message = await this.db.message.create({
      data: {
        senderId: userId,
        chatroomId,
        content,
        createdAt: date
      }
    })
    return new MessageDTO(message)
  }

  async createChatroom (user1Id: string, user2Id: string): Promise<ChatroomDTO> {
    const chatroom = await this.db.chatroom.create({
      data: {
        users: {
          connect: [
            {
              id: user1Id
            },
            {
              id: user2Id
            }
          ]
        }
      },
      include: {
        users: true
      }
    })
    return new ChatroomDTO(chatroom)
  }

  async getChatroomMessages (chatroomId: string): Promise<MessageDTO[]> {
    const messages = await this.db.message.findMany({
      where: {
        chatroomId
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
    return messages.map(message => new MessageDTO(message))
  }

  async findChatroomByMembers (userIds: string[]): Promise<ChatroomDTO | null> {
    const chatroom = await this.db.chatroom.findFirst({
      where: {
        users: {
          every: {
            id: {
              in: userIds
            }
          }
        }
      },
      include: {
        users: true
      }
    })
    return (chatroom) ? new ChatroomDTO(chatroom) : null
  }

  async getChatroomById (chatroomId: string): Promise<ExtendedChatroomDTO | null> {
    const chatroom = await this.db.chatroom.findUnique({
      where: {
        id: chatroomId
      },
      include: {
        users: true,
        messages: true
      }
    })
    return (chatroom) ? new ExtendedChatroomDTO(chatroom) : null
  }

  async getChatroomsByUserId (userId: string): Promise<ChatroomDTO[]> {
    const chatrooms = await this.db.chatroom.findMany({
      where: {
        users: {
          some: {
            id: userId
          }
        }
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })
    return chatrooms.map(chatroom => new ChatroomDTO({ ...chatroom, lastMessage: chatroom.messages[0] }))
  }
}
