import { Follow } from "@prisma/client"

export interface FollowerService{
    createFollow: (followerId: string, followedId: string) => Promise<void>
    deleteFollow: (followerId: string, followedId: string) => Promise<void>
}