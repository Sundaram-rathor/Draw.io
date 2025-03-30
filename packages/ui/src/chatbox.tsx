'use client'

import Bubbl from "./components/Bubble";
import ShareIcon from "./icons/ShareIcon";
import Dots from "./icons/Dots";
import { useState } from "react";
import axios from "axios";
import {BACKEND_URL , FRONTEND_URL} from '@repo/backend-common/config'

export default function page(){
    
    const [slug, setSlug] = useState('')

    const CreateRoom = async()=>{

        try {
          const response = await axios.post(`${BACKEND_URL}/create-room`,{
            roomId:slug
          },{
            headers:{
                Authorization:localStorage.getItem('token')
            }
          })

          if(response.data.success){
            console.log(response.data)
            alert('new room has been created')
            window.location.href = `${FRONTEND_URL}/room/${slug}`

          }
        } catch (error) {
            console.log(error)
            alert('not able to create rooom')
        }
    }


    return <div style={{
        height:'100vh',
        width:'77vw',
        backgroundColor:'#121212',
        padding:'10px 10px'
    }}>
        <div style={{
            display:'flex',
            height:'5vh',
            width:'100%',
            alignItems:'center',
            justifyContent:'space-between',
            padding:'10px 20px',
            borderBottomColor:'#262626'
        }}>
            <div>Slug Name</div>
            <div style={{
                display:'flex',
                gap:'10px'
            }}>
                    <div> 
                        <Bubbl icon={<ShareIcon/>} text="Share"/> 
                    </div>
                    <div>
                        <Bubbl icon={<Dots/>} text="Option"/>
                    </div>
            </div>
        </div>
        <div style={{
            padding:'10px 20px',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            height:'90vh'
        }}>

            <div style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center',
                justifyContent:'center'
            }}>
                            <div style={{
                                fontSize:'25px'
                            }}>Create a room </div>

                                <div>
                                <input type="text" style={{
                                    padding:'15px 100px',
                                    borderRadius:'50px',
                                    marginTop:'20px',
                                    fontSize:'15px'
                                }}
                                placeholder="Enter room name"
                                value={slug}
                                onChange={(e)=> setSlug(e.target.value)}
                                />

                                </div>
                                <div style={{
                                    marginTop:'20px'
                                }}>
                                    <button style={{
                                        padding:'10px 20px',
                                        borderRadius:'20px',
                                        cursor:'pointer',
                                        backgroundColor:'transparent'
                                    }}
                                    onClick={CreateRoom}
                                    >Create Button</button>
                                </div>
                          </div>

        </div>
    </div>
}