/**
 * @swagger
 * components:
 *   schemas:
 *     UserDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the user.
 *         name:
 *           type: string
 *           nullable: true
 *           description: The name of the user (nullable).
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user account was created.
 *         profilePicture:
 *           type: string
 *           nullable: true
 *           description: URL of the user's profile picture (nullable).
 *         private:
 *           type: boolean
 *           description: Indicates whether the user's profile is set to private (true) or public (false).
 */
export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
    this.profilePicture = user.profilePicture
    this.private = user.private
  }

  id: string
  name: string | null
  createdAt: Date
  profilePicture: string | null
  private: boolean
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
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
