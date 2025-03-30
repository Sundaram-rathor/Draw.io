import ChattingRoom from '../../../components/ChattingRoom'

interface props {
    params:{
        slug:string
    }
}
export default async function({params}:props){

    const {slug} = await params

    return <div>
        <ChattingRoom slug={slug} />
    </div>
}