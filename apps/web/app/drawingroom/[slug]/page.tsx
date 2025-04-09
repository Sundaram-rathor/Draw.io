"use client"
import { use, useEffect, useRef, useState } from 'react'
import {Draw} from "../../../utils/draw";
import {BACKEND_URL} from '@repo/backend-common/config'
import axios from 'axios';
import { IconBtn } from '../../components/IconBtn';
import { Circle, PenLine, RectangleHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function({params}:{params:Promise<{slug:string}>}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [shapes, setShapes] = useState([])
    const [browserHeight, setBrowserHeight] = useState<number>()
    const [browserWidth, setBrowserWidth] = useState<number>()
    const [activated, setActivated] = useState<string>('rect')
    


    const {slug} = use(params)

   window.addEventListener('resize', ()=>{
            setBrowserHeight(window.innerHeight)
            setBrowserWidth(window.innerWidth)
        })
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
                    console.log(response.data.shapes)
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
        

    },[slug,browserWidth,activated])

    useEffect(()=>{
        

        if(canvasRef.current){
            const canvas = canvasRef.current;


            Draw(canvas,shapes,slug, activated);
        }
    },[shapes,activated])

    useEffect(()=>{
        console.log(shapes)
        console.log(browserHeight)
        console.log(browserWidth)
    },[shapes,browserHeight, browserWidth])

    console.log("Component Rendered");



    return <div>
         <canvas ref={canvasRef} width={browserWidth || window.innerWidth} height={browserHeight || window.innerHeight}></canvas> 
        {/* <div>{browserWidth} {browserHeight}hi there</div> */}
        <TopBar activated={activated} setActivated={setActivated} />
    </div>
}



function TopBar({activated, setActivated}:{activated:string, setActivated:any}){
    const router = useRouter();
  return  <div style={{
    position:'fixed',
    top:10,
    left:10,
    display:'flex',
    justifyContent:'space-between',
    width:'95vw'
  }} >
        <div style={{
            display:'flex',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
        }}>
                <IconBtn Icon={<Circle/>} OnClick={()=> setActivated('circle')} activated={activated == 'circle'}/>
                <IconBtn Icon={<RectangleHorizontal/>} OnClick={()=> setActivated('rect')} activated={activated == 'rect'}/>
                <IconBtn Icon={<PenLine/>} OnClick={()=> setActivated('line')} activated={activated == 'line'}/>
        </div>
        
    </div>
}