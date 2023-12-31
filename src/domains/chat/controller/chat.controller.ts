import { Router } from 'express'
import { UserRepositoryImpl } from '@domains/user/repository'
import { UserServiceImpl } from '@domains/user/service'
import { ChatRepositoryImpl } from '@domains/chat/repository/chat.repository.impl'
import { ChatServiceImpl } from '@domains/chat/service/chat.service.impl'
import { ChatService } from '@domains/chat/service/chat.service'
import { db } from '@utils'
import io from '@server'

export const chatRouter = Router()

export const chatService: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db), new UserServiceImpl(new UserRepositoryImpl(db)))

chatRouter.post('/chatroom/:userId', async (req, res) => {
  const { userId } = res.locals.context
  const { userId: searchedUser } = req.params

  const chatroom = await chatService.findOrCreateChatroom(userId, searchedUser)

  return res.status(200).json(chatroom)
})

chatRouter.get('/chatroom/chats', async (req, res) => {
  const { userId } = res.locals.context

  const chatrooms = await chatService.getChatroomsByUser(userId)

  return res.status(200).json(chatrooms)
})

chatRouter.get('/chatroom/:chatroomId', async (req, res) => {
  const { chatroomId } = req.params

  const chatroom = await chatService.getChatroom(chatroomId)

  return res.status(200).json(chatroom)
})
