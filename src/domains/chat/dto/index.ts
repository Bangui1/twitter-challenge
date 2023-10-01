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
  }

  id: string
  users: UserDTO[]
}
