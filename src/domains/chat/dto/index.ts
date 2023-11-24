import { UserDTO } from '@domains/user/dto'

export class MessageDTO {
  constructor (message: MessageDTO) {
    this.id = message.id
    this.senderId = message.senderId
    this.chatroomId = message.chatroomId
    this.content = message.content
    this.createdAt = message.createdAt
  }

  id: string
  senderId: string
  chatroomId: string
  content: string
  createdAt: Date
}

export class ChatroomDTO {
  constructor (chatroom: ChatroomDTO) {
    this.id = chatroom.id
    this.users = chatroom.users.map(user => new UserDTO(user))
    this.lastMessage = chatroom.lastMessage ? new MessageDTO(chatroom.lastMessage) : undefined
  }

  id: string
  users: UserDTO[]
  lastMessage?: MessageDTO
}

export class ExtendedChatroomDTO {
  constructor (chatroom: ExtendedChatroomDTO) {
    this.id = chatroom.id
    this.users = chatroom.users.map(user => new UserDTO(user))
    this.messages = chatroom.messages.map(message => new MessageDTO(message))
  }

  id: string
  users: UserDTO[]
  messages: MessageDTO[]
}
