import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const UserMiddleware = (req:Request,res:Response,next:NextFunction)=>{

    const token = req.headers["authorization"]
    //@ts-ignore
    const decoded = jwt.verify(token, JWT_SECRET)
    //@ts-ignore
    if(!decoded || !decoded.userId){
        res.json({
            messsage:'invalid token'
        })
        return;
    }

    
        //@ts-ignore
     req.userId = decoded.userId
     next()
     return;
    
}