import React from "react"


interface bubbleProps {
    icon: React.ReactNode,
    text:string
}
export default function Bubbl({icon, text}:bubbleProps){
    return <div style={{
        height:'40px',
        width:'90px',
        borderRadius:'20px',
        borderColor:'red',
        backgroundColor:'#2F2F2F',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        borderWidth:'5px',
        gap:'3px',
        cursor:'pointer',
        
    }}>
     {icon}
     {text}

    </div>

}