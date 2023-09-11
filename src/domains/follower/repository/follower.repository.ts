import { Follow } from "@prisma/client"


export interface FollowerRepository {
    create: (followerId: string, followedId: string) => Promise<void>
    delete: (followId: string) => Promise<void>
    getById: (followerId: string, followedId: string) => Promise<Follow | null>
}