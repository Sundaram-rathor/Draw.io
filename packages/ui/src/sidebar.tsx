'use client'

import { BACKEND_URL, FRONTEND_URL } from "@repo/backend-common/config";
import axios from "axios";
import { useEffect, useState } from "react";

interface room {
    id:number,
    slug:string,
    adminId:string,
    createdAt:string
}

interface ApiResponse {
    success:boolean,
    message:String,
    rooms:room[]
}
export default function page(){
    const [data, setData] =  useState < ApiResponse| null>()
    const [currentroom, setCurrentRoom] = useState('')

    const ChangeLocation= (slug:string)=>{
        window.location.href = `${FRONTEND_URL}/chat/${slug}`
    }


    useEffect(()=>{
            const fetchData = async()=>{
                try {
                    const response = await axios.get(`${BACKEND_URL}/rooms`,{
                        headers:{
                            Authorization: localStorage.getItem('token')
                        }
                    })

                    if(response.data.success){
                        setData(response.data)
                        console.log(response.data)
                    }else{
                        console.log(response.data)
                    }
                } catch (error) {
                    console.log(error)
                }
            }

            fetchData()
    },[])

    
    return <div style={{
        height:'100vh',
        width:'23vw',
        backgroundColor:'#171717',
        padding:'20px 20px',
        fontSize:'20px'
    }}>
        Rooms

        <div style={{
            height:'90vh',
            width:'100%',
            padding:'20px 20px'
        }}>
            {data ? (data.rooms.map((item)=>{
                return <div 
                key={item.id}
                style={{
                    backgroundColor:'#2F2F2F',
                    height:'5vh',
                    display:'flex',
                    padding:'0 10px',
                    alignItems:'center',
                    borderRadius:'5px',
                    marginTop:'10px',
                    cursor:'pointer'
                }}
                onClick={()=>{
                    setCurrentRoom(item.slug)
                    ChangeLocation(item.slug)
                    
                }}
                > {item.slug}</div>
            })):(
                <div>
                    no room
                </div>
            )}
        </div>
    </div>
}