import { ReactNode } from "react"

interface iconProp {
    Icon: ReactNode,
    activated: boolean,
    OnClick: ()=>void
}

export function IconBtn({Icon,activated, OnClick}:iconProp){
    return <div style={{
        padding:'6px 6px',
        backgroundColor: `${activated ? "red":"gray"}`,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        
    }}
    onClick={OnClick}>
        {Icon}
    </div>
}