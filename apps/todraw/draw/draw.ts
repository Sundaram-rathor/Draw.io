import { BACKEND_URL } from "@repo/backend-common/config";
import axios from "axios";


type Shape = {
    type:"rect",
    x:number,
    y:number,
    width:number,
    height:number
} | {
    type: "circle",
    centerX: number,
    centerY : number,
    radius: number 
}

let socket:WebSocket| null;

let existingShapes:Shape[] = []



function clearCanvas(existingShapes:Shape[], canvas:HTMLCanvasElement){

    const ctx = canvas.getContext('2d')

    if(!ctx) return;

    ctx?.clearRect(0,0,canvas.width, canvas.height)
    ctx.fillStyle = "rgb(18,18,18)"
    ctx.fillRect(0,0, canvas.width,canvas.height)    

    existingShapes.map((shape)=>{
        if(shape.type == 'rect'){
            ctx.strokeRect(shape.x,shape.y, shape.width, shape.height)
        }
    })
    
}

export function Draw(canvas: HTMLCanvasElement){
            
            const ctx = canvas.getContext('2d')

            

            if(!ctx) return;

            // creating a rectangle
            // ctx?.strokeRect(25,25,100,100)

            //adding eventlistener to canvas
            ctx.fillStyle = 'rgb(18, 18, 18)'
            let startX = 0;
            let startY = 0;

            const MoveEvent =(e:MouseEvent)=>{

                console.log(e.clientX)
                console.log(e.clientY)

                const width = e.clientX - startX;
                const height = e.clientY - startY;
                
                clearCanvas(existingShapes, canvas)
                
                ctx.strokeStyle = 'rgba(255,255,255)'
                ctx.strokeRect(startX, startY, width, height)

            }


            canvas.addEventListener("mousedown", (e)=>{
                console.log(e.clientX)
                console.log(e.clientY)

                startX = e.clientX
                startY = e.clientY
                canvas.addEventListener("mousemove",MoveEvent)
            })

           

            canvas.addEventListener("mouseup", (e)=>{
                
                const width =  e.clientX - startX;
                const height = e.clientY - startY;
                
                existingShapes.push({
                    type:"rect",
                    x:startX,
                    y:startY,
                    height,
                    width
                })




                canvas.removeEventListener("mousemove",MoveEvent)
            })        


                   


}

