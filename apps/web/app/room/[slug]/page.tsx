
import React from 'react'
import { BACKEND_URL } from '@repo/backend-common/config'

import axios from 'axios'

interface paramProps {
    params:{
        slug:string
    }
}

async function page({params}:paramProps) {

    const {slug} = await params

   try {
    
    const response = await axios.get(`${BACKEND_URL}/${slug}`,{
        headers:{
            'Authorization':localStorage.getItem('token')
        }
    }).then((response)=> console.log(response.data)).catch((err)=> console.log(err))



    return <div> data : {JSON.stringify(response)}</div>

   } catch (error) {
        console.log(`error fetching room data`)
        return <div> error fetching data {slug}</div>
   }

}

export default page