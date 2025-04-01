import { BACKEND_URL, WS_URL } from "@repo/backend-common/config";
import axios from "axios";

let sock: WebSocket | null = null;
let existingShapes: any = [];

function wsconnection(slug: string, canvas: HTMLCanvasElement) {
    if (sock) return; // Avoid multiple WebSocket connections

    sock = new WebSocket(`${WS_URL}?token=${localStorage.getItem("token")}`);

    sock.onopen = () => {
        console.log("WebSocket connected");
        sock?.send(JSON.stringify({ type: "join_room", slug }));
    };

    sock.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    sock.onclose = () => {
        console.log("WebSocket disconnected");
        sock = null;
    };

    sock.onmessage = (event) => {
        console.log("New shape received:", event.data);
        try {
            const newShape = JSON.parse(event.data).shape;

            const data = {
                type : newShape.type,
                properties:{
                    x: newShape.properties.x,
                    y: newShape.properties.y,
                    width:newShape.properties.width,
                    height:newShape.properties.height,
                }
            }
            
            existingShapes.push(data);
            clearCanvas(existingShapes, canvas); // Redraw all shapes
            
        } catch (err) {
            console.error("Error parsing WebSocket message:", err);
        }
    };
}

const sendShape = (message: any, slug:string) => {
    if (!sock) {
        console.log("WebSocket is not connected");
        return;
    }

    const sendingData = {
        type: "shape",
        data: {
            type: message.type,
            properties: message.properties,
        },
        slug
    };

    sock.send(JSON.stringify(sendingData));
};

function clearCanvas(existingShapes: any, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(18,18,18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape: any) => {
        ctx.strokeStyle = "rgba(255,255,255)";

        if (shape.type === "rect") {
            ctx.strokeRect(shape.properties.x, shape.properties.y, shape.properties.width, shape.properties.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.properties.centerX, shape.properties.centerY, shape.properties.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });
}

export function Draw(canvas: HTMLCanvasElement, shapes: any, slug: string) {
    wsconnection(slug, canvas); // Ensure WebSocket is set up

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    existingShapes = [...shapes];
    console.log("Existing Shapes:", existingShapes);

    let startX = 0;
    let startY = 0;

    const MoveEvent = (e: MouseEvent) => {
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        clearCanvas(existingShapes, canvas);

        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.strokeRect(startX, startY, width, height);
    };

    canvas.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        canvas.addEventListener("mousemove", MoveEvent);
    });

    canvas.addEventListener("mouseup", (e) => {
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        const newShape = {
            type: "rect",
            properties: {
                x: startX,
                y: startY,
                width,
                height,
            },
            userId: "me",
        };

        existingShapes.push(newShape);
        sendShape(newShape,slug);
        clearCanvas(existingShapes, canvas);

        canvas.removeEventListener("mousemove", MoveEvent);
    });
}
