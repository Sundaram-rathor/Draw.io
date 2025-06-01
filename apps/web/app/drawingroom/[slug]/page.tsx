"use client";

import { use, useEffect, useRef, useState } from 'react'
import {Draw} from "../../../utils/draw";
import {BACKEND_URL} from '@repo/backend-common/config'
import axios from 'axios';
import { IconBtn } from '../../components/IconBtn';
import { Circle, PenLine, RectangleHorizontal , Diamond, MoveRight, SpellCheck, Image, Eraser, EllipsisVertical, Menu, Waypoints} from 'lucide-react';

export default function({params}:{params:Promise<{slug:string}>}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [shapes, setShapes] = useState([])
    const [browserHeight, setBrowserHeight] = useState<number>()
    const [browserWidth, setBrowserWidth] = useState<number>()
    const [activated, setActivated] = useState<string>('rect')
    const [imageData, setImageData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    


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

            console.log(imageData)
            Draw(canvas,shapes,slug, activated);
        }
    },[shapes,activated,imageData])

    useEffect(()=>{
        console.log(shapes)
        console.log(browserHeight)
        console.log(browserWidth)
    },[shapes,browserHeight, browserWidth])

    console.log("Component Rendered");



    return <div>
         <canvas ref={canvasRef} width={browserWidth || window.innerWidth} height={browserHeight || window.innerHeight}></canvas> 
        {/* <div>{browserWidth} {browserHeight}hi there</div> */}
        <TopBar activated={activated} setActivated={setActivated} setImageData={setImageData} loading={loading} imageData={imageData} setLoading={setLoading}/>
    </div>
}



function TopBar({activated, setActivated, setImageData, loading, imageData, setLoading}:{activated:string, setActivated:any, setImageData:any, loading:boolean, imageData:string | null, setLoading:any}){

    const [showImageInput, setShowImageInput] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
   // Show dropdown when image icon is selected
    useEffect(() => {
        setShowImageInput(activated === 'image');
    }, [activated]);

    return  <div style={{
        position:'fixed',
        top:0,
        left:0,
        padding:'20px',
        display:'flex',
        justifyContent:'space-between',
        width:'100vw',
        alignItems:'center',
    }} >
        <div style={{
            display:'flex',
            alignItems:'center'
        }}>
            <IconBtn Icon={<Menu/>} OnClick={()=> setActivated('menu')} activated={activated == 'menu'}/>
        </div>
        <div style={{
            display:'flex',
            backgroundColor: '#232329',
            padding:'5px 0',
            borderRadius:'10px',
            margin:'0 10px',
            position: 'relative'
        }}>
            <IconBtn Icon={<Circle/>} OnClick={()=> setActivated('circle')} activated={activated == 'circle'}/>
            <IconBtn Icon={<RectangleHorizontal/>} OnClick={()=> setActivated('rect')} activated={activated == 'rect'}/>
            <IconBtn Icon={<PenLine/>} OnClick={()=> setActivated('line')} activated={activated == 'line'}/>
            <IconBtn Icon={<Diamond/>} OnClick={()=> setActivated('diamond')} activated={activated == 'diamond'}/>
            <IconBtn Icon={<MoveRight/>} OnClick={()=> setActivated('arrow')} activated={activated == 'arrow'}/>
            <IconBtn Icon={<SpellCheck/>} OnClick={()=> setActivated('text')} activated={activated == 'text'}/>
            <div style={{position:'relative'}}>
                <IconBtn Icon={<Image/>} OnClick={()=> setActivated('image')} activated={activated == 'image'}/>
                {showImageInput && (
                    <div style={{
                        position: 'absolute',
                        top: '40px',
                        left: 0,
                        background: '#232329',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        padding: '10px',
                        zIndex: 100,
                        minWidth: '200px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                        <label style={{color: 'white', fontSize: 14, marginBottom: 4, display: 'block'}}>Website URL:</label>
                        <input
                            type="text"
                            value={imageUrl || ''} 
                            onChange={e => setImageUrl(e.target.value)}
                            placeholder="Paste image URL here"
                            
                            style={{
                                width: '100%',
                                padding: '6px',
                                borderRadius: '4px',
                                border: '1px solid #888',
                                fontSize: 14
                            }}
                        />
                        {/* You can add a button here to confirm adding the image */}
                        {loading ? <button disabled>Loading...</button> : <button onClick={() => {
                            if (!imageUrl) {
                                console.warn('Image URL is empty');
                                return;
                            }
                            setLoading(true);
                            axios.get(`https://api.apiflash.com/v1/urltoimage?access_key=4e2e5209eba9450a96f93912db68dfc2&wait_until=page_loaded&response_type=json&url=${imageUrl}`)
                                .then(response => {
                                    console.log('Image URL submitted:', imageUrl);
                                    console.log('Image response:', response.data);
                                    setImageData(response.data);
                                    setLoading(false);
                                    setImageUrl(''); // Clear input after submission
                                })
                                .catch(error => {
                                    console.error('Error fetching image:', error);
                                });
                        }}>Fetch</button>}
                    </div>
                )}
            </div>
            <IconBtn Icon={<Eraser/>} OnClick={()=> setActivated('eraser')} activated={activated == 'eraser'}/>
            <IconBtn Icon={<EllipsisVertical/>} OnClick={()=> setActivated('ellipsis')} activated={activated == 'ellipsis'}/>
        </div>
        <div style={{
            display:'flex',
            alignItems:'center',
        }}>
            <IconBtn Icon={<Waypoints/>} OnClick={()=> setActivated('waypoints')} activated={activated == 'waypoints'}/>
            <IconBtn Icon={<Menu/>} OnClick={()=> setActivated('menu')} activated={activated == 'menu'}/>   
        </div>
    </div>
}