import {number, string, z} from 'zod'


export const UserTypes = z.object({
    email: string(),
    password:string()
})

export const RoomTypes = z.object({
    roomId:string()
})