
import Sidebar from '@repo/ui/sidebar'
import Chatbox from '@repo/ui/chatbox'
export default function page(){
    return <div style={{
        height:'100vh',
        width:'100vw',
        display:'flex'
    }}>

    <Sidebar/>
    <Chatbox/>


        
        
    </div>

}