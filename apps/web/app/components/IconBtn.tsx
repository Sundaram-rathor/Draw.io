import { ReactNode } from "react"

interface iconProp {
    Icon: ReactNode,
    activated?: boolean,
    OnClick: ()=>void
}

export function IconBtn({Icon,activated, OnClick}:iconProp){
    return <div style={{
        padding:'6px 6px',
        backgroundColor: `${activated ? "#403E6A":"#232329"}`,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        cursor:'pointer',
        borderRadius:'20%',
        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        margin:'0 5px',
        transition: 'background-color 0.3s ease',
        width:'30px',
        height:'30px',
        
    }}
    onClick={OnClick}>
        {Icon}
    </div>
}