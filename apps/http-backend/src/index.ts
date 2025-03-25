import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserMiddleware } from "./middleware/UserMiddleware";
import { RoomTypes, UserTypes } from "@repo/common/types";
import { prismaClient } from "@repo/DB/prismaDB";
import bcrypt from 'bcrypt'

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
    res.json({ message: "Home route" });
});

app.post("/signup", async (req: Request, res: Response): Promise<void> => {
    const data = UserTypes.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({ message: "Not valid inputs" });
        return;
    }
    const hashedPass = await bcrypt.hash(data.data.password ,10)

    try {
        await prismaClient.user.create({
            data: {
                email: data.data.email,
                password: hashedPass,
            },
        });
        res.json({ message: "User created" });
    } catch (error) {
        res.status(409).json({ message: "Username taken" });
    }
});

app.post("/signin", async (req: Request, res: Response)=> {
    const data = UserTypes.safeParse(req.body);
    if (!data.success) {
        res.status(400).json({ message: "Not valid inputs" });
        return;
    }

    const user = await prismaClient.user.findFirst({
        where:{
            email:data.data.email
        }
    })
    if(!user){
        res.json({
            message:'user not found'
        })
        return;
    }

    const isPassCorrect = await bcrypt.compare(data.data.password, user?.password)

    if(!isPassCorrect){
        res.json({
            message:'password not correct'
        })
        return;
    }
    
    

    const userId = user?.id;
    const token = jwt.sign({ userId }, JWT_SECRET);
    res.json({ message: "User signed in", token });
});

app.post("/create-room", UserMiddleware, async (req: Request, res: Response): Promise<void> => {
    //@ts-ignore
    const userId = req.userId
    const parsedData = RoomTypes.safeParse(req.body)
    
    console.log(userId)

    const user = await prismaClient.user.findFirst({
        where:{
            id:userId
        }
    })
    console.log(user?.email)

    if(!parsedData.data?.roomId){
        res.json({
            message:'room id is required'
        })
        return;
    }
    
    //creating a room
    
    try {
        const room = await prismaClient.room.create({
            data:{
                adminId:userId,
                slug:parsedData.data?.roomId
            }
        })
    
        
    
        res.json({ 
            message: `room with rooom id ${room.id} is created`
        });
    } catch (error) {
        console.log('room with this id already exists')

        res.json({
            message:'room with this id already exists',
            error
        })
    }
    
});

app.get('/chat/:roomId', UserMiddleware, async(req,res)=>{

    //getting room id from params
    const roomId = Number(req.params.roomId);

    //retriving messages from respective room id
    const message = await prismaClient.chat.findMany({
        where:{
            roomId:roomId
        },
        orderBy:{
            id:'desc'
        },
        take:50
    })

    if(message == null){
        res.json({
            message:'no messages in this room'
        })
        return;
    }


    res.json({
        message:'messages retrived',
        data:message
    })
})

app.listen(8000, () => {
    console.log("Server is running at port 8000");
});
