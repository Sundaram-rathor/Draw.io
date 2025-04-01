import express, { request, Request, response, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { UserMiddleware } from "./middleware/UserMiddleware";
import { RoomTypes, UserTypes } from "@repo/common/types";
import { prismaClient } from "@repo/DB/prismaDB";
import bcrypt from 'bcrypt'
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())

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
        res.json({ 
            message: "User created",
            success:true
        });
    } catch (error) {
        res.status(409).json({ 
            message: "Username taken",
            success:false
         });
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
            message:'user not found',
            success:false
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
    res.json({ message: "User signed in", token, success:true });
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
            message:'room id is required',
            success:false
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
            message: `room with rooom id ${room.id} is created`,
            success:true
        });
    } catch (error) {
        console.log('room with this id already exists')

        res.json({
            message:'room with this id already exists',
            error,
            success:false
        })
    }
    
});


app.get('/rooms',UserMiddleware, async (req: Request, res:Response)=>{
    

    try {
        const rooms = await prismaClient.room.findMany({
            where:{
                //@ts-ignore
                adminId:req.userId
            }
        })

        res.json({
            success:true,
            message:'rooms retrived',
            rooms
        })
        return;
    } catch (error) {
        console.log(error)
        res.json({
            message:'error in rooms data',
            success:false
        })
    }


})

app.get('/room/:slug', UserMiddleware, async(req,res)=>{

    //getting room id from params
    const slug = req.params.slug;

    //retriving messages from respective room id
    const room = await prismaClient.room.findFirst({
        where:{
            slug:slug
        }
    })
    if(!room){
        res.json({
            message:'no room found',
            success:false
        })
        return;
    }
    const message = await prismaClient.chat.findMany({
        where:{
            roomId:room.id
        },
        orderBy:{
            id:'desc'
        },
        take:50
    })

    

    if(message == null){
        res.json({
            message:'no messages in this room',
            success:false
        })
        return;
    }




    res.json({
        message:'messages retrived',
        data:message,
        success:true,
        adminId:room.adminId
    })
})

app.get('/shapes/:slug', UserMiddleware, async (req,res)=>{

    const slug = req.params.slug
    console.log(slug)
    const room = await prismaClient.room.findFirst({
        where:{
            slug
        }
    })
    console.log(room)

    if(!room){
        res.json({
            message:'no room with this slug',
            success:false
        })

         return;
    }

    const shapes = await prismaClient.shape.findMany({
        where:{
            roomId : room.id
        }
    })
    console.log(shapes)

    if(shapes == null){
        res.json({
            message:"no shapes",
            success:false
        })  
    }else{
        res.json({
            message:'shapes retrived',
            shapes,
            success:true,
            adminId:room.adminId
        })
    }




})

app.listen(8000, () => {
    console.log("Server is running at port 8000");
});
