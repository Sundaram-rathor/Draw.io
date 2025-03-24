import { WebSocketServer } from "ws";
import {JWT_SECRET} from '@repo/backend-common/config'
import jwt, { JwtPayload } from 'jsonwebtoken'


const wss = new WebSocketServer({port:8080})

wss.on('connection',(socket, request)=>{
    const url = request.url;
    if(!url){
        return; 
    }

    const queryParams = new URLSearchParams(url?.split('?')[1]);
    const token = queryParams.get('token')
    //@ts-ignore
    const decoded = jwt.verify(token,JWT_SECRET)
    
    if(!decoded || !(decoded as JwtPayload).userId){
        socket.close();
        return; 
    }
    console.log('user connected')

    socket.on('message',(data)=>{
        socket.send('pong')
    })
})