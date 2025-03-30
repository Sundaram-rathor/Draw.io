
import Sidebar from '@repo/ui/sidebar'
import ChattingRoom from '../../components/ChattingRoom'

interface props{
    params:{
        slug:string
    }
}
export default async function page({params}:props){

    const {slug} = await params
    return <div style={{
        height:'100vh',
        width:'100vw',
        display:'flex'
    }}>

    <Sidebar/>
   <ChattingRoom slug={slug}/>


        
        
    </div>

}