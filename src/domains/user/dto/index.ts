export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  createdAt: Date
  profilePicture: string | null
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
    this.private = user.private
  }

  email!: string
  username!: string
  password!: string
  private!: boolean
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserViewDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user.
 *         name:
 *           type: string
 *           nullable: true
 *           description: The name of the user (nullable).
 *         username:
 *           type: string
 *           description: The username of the user.
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL of the user's profile picture (nullable).
 */

export class UserViewDTO {
  constructor (user: UserViewDTO) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
}
