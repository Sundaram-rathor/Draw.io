"use client"
import { use, useEffect, useRef, useState } from 'react'
import {Draw} from "../../../utils/draw";
import {BACKEND_URL, WS_URL} from '@repo/backend-common/config'
import axios from 'axios';

export default function({params}:{params:Promise<{slug:string}>}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [shapes, setShapes] = useState([])
    const {slug} = use(params)

    useEffect(()=>{

        if (!slug) {
            console.warn("Slug is undefined, skipping API call.");
            return;
        }
    
        console.log("Fetching shapes for slug:", slug);
       

        const fetchingShapes =async()=>{
            try {
                const slg= await slug

                console.log('hello i am here', slg)
                const token = localStorage.getItem('token') || '';
                if (!token) {
                    console.warn('No token found in localStorage');
                }
                console.log('hi')
                const response =  await axios.get(`${BACKEND_URL}/shapes/${slug}`,{
                    headers:{
                        Authorization:`${localStorage.getItem('token')}`
                    }
                })
                console.log('Request completed:', response);

                console.log('hi')
                if(response.data.success){
                    console.log(response.data)
                    setShapes(response.data.shapes)
                }else{
                    console.log('not able to fetch data', response.data)
                }
                console.log('hi')

            } catch (error) {
                console.log('error in shape fetching', error)
            }
        }

        
            fetchingShapes();
        

    },[slug])

    useEffect(()=>{
        

        if(canvasRef.current){
            const canvas = canvasRef.current;


            Draw(canvas,shapes,slug);
        }
    },[canvasRef])

    console.log("Component Rendered");



    return <div>
        <canvas ref={canvasRef} width={1980} height={720}></canvas>
    </div>
}