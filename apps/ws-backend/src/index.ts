import { WebSocket, WebSocketServer } from "ws";
import {JWT_SECRET} from '@repo/backend-common/config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { prismaClient } from '@repo/DB/prismaDB'


interface users {
    
        userId:String
        socket:WebSocket
        rooms:Number[]
    
}

const wss = new WebSocketServer({port:8080})
const users:users[] = []

function checkUser(token:string){
    
   try {
    const decoded = jwt.verify(token,JWT_SECRET)

    if(!decoded || !(decoded as JwtPayload).userId){
        return false;
    }

    return (decoded as JwtPayload).userId;

   } catch (error) {
    console.log('error in jwt ',error)
    return null;
   }
}

function addToRoom(roomId:Number, userId:string){

    const user = users.filter((item, index)=>{
        if(item.userId == userId){
            item.rooms.push(roomId)
            return;
        }
    })
    
    if(user == undefined){
        return 'user not found';
    }else{
        return 'room added'
    }
}

wss.on('connection', (socket, request)=>{

    //extracting url
    const url = request.url;
    if(!url){
        return; 
    }
    //extracting token
    const queryParams = new URLSearchParams(url?.split('?')[1]);
    const token = queryParams.get('token')
    if(!token){
        socket.close()
        return;
    }
    // checking user based on token
    const userId = checkUser(token);

    //Returning if user not found
    if(!userId){
        socket.send('user not found')
        socket.close()
        return;
    }
    

    users.push({
        userId:userId,
        socket,
        rooms:[]
    })
    
    console.log('user connected')

    //on receiving the message

    socket.on('message', async(data)=>{
        //parsing the string data to json data
        const parsedData = JSON.parse(data as unknown as string);


        //joining a room
        if(parsedData.type == 'join_room'){
            const added = addToRoom(parsedData.roomId, userId)

            if(added == 'user not found'){
                socket.send('user not found')
            }

        }

        //leaving a room
        if(parsedData.type == 'leave_room'){
            const user = users.find((item)=> item.socket == socket)
            if(!user){
                return;
            }
            user.rooms = user?.rooms.filter((item)=> item !== parsedData.roomId)
        }

        //chatting logic

        if(parsedData.type == 'chat'){
            const roomId = parsedData.roomId
            const message = parsedData.message

            await prismaClient.chat.create({ 
                data:{
                message,
                userId,
                roomId
            }
               
            })

            users.forEach((user)=>{
                if(user.rooms.includes(roomId)){
                    user.socket.send(JSON.stringify({
                        type:'chat',
                        roomId,
                        message
                    }))
                }
            })
        }


    })
})