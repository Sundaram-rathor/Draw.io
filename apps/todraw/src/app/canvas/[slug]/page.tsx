"use client"
import { useEffect, useRef, useState } from 'react'
import {Draw} from "../../../../draw/draw";
import {BACKEND_URL, WS_URL} from '@repo/backend-common/config'
import axios from 'axios';

export default function({params}:{params:{slug:string}}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [mainSlug, setMainSlug] = useState('')
    const [shapes, setShapes] = useState()
    const [socket , setSocket] = useState<WebSocket | null>()

    useEffect(()=>{
        if(canvasRef.current){
            const canvas = canvasRef.current;

            Draw(canvas);
        }
    },[canvasRef])

    useEffect(()=>{
        const fetchShapes = async()=>{
            const {slug} = await params
            setMainSlug(slug)
            const response = await axios.get(`${BACKEND_URL}/shapes/${mainSlug}`,{
                headers:{
                    Authorization:`${localStorage.getItem('token')}`
                }
            })

            if(response.data.success){
                console.log(response.data)
                setShapes(response.data)
            }else{
                console.log('not able  to fetch data from server')
            }



        }
        fetchShapes();

        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem('token')}`)

        ws.onopen = function(event){
            console.log('ws connected')
        }


        setSocket(ws)
        return ()=>{
            
        }
    },[])

    return <div>
        <canvas ref={canvasRef} width={1980} height={720}></canvas>
    </div>
}