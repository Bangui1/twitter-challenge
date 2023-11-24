import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { Constants, NodeEnv, Logger, socketWithAuth } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'
import { chatService } from '@domains/chat'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: Constants.CORS_WHITELIST
  }
})

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)

app.use('/api', router)

app.use(ErrorHandling)

server.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})

io.use(socketWithAuth)
io.on('connection', async (socket) => {
  const { userId } = socket.handshake.auth.userId

  socket.on('message', async ({ chatId, content, date }) => {
    console.log(chatId, content, date)
    const message = await chatService.createMessage(userId, chatId, content, date)
    socket.broadcast.to(chatId).emit('recieve_message', message)
  })

  socket.on('chatrooms', async () => {
    const chatrooms = await chatService.getChatroomsByUser(userId)
    socket.join(chatrooms.map((chatroom) => chatroom.id))
  })

  socket.on('chatroom', async ({ chatroomId }) => {
    socket.join(chatroomId)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id)
  })
})

export { app }

export default io
