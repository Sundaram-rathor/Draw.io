import { WS_URL } from "@repo/backend-common/config";
// i want to dynamically write the text in the canvas

let sock: WebSocket | null = null;
let existingShapes: any[] = [];

function clearCanvas(existingShapes: any, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(18,18,18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.forEach((shape:any) => {
        ctx.strokeStyle = "rgba(255,255,255)";
        if (shape.type === "rect") {
            ctx.strokeRect(
                shape.properties.x,
                shape.properties.y,
                shape.properties.width,
                shape.properties.height
            );
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.ellipse(
                shape.properties.centerX,
                shape.properties.centerY,
                Math.abs(shape.properties.radiusX),
                Math.abs(shape.properties.radiusY),
                0,
                0,
                2 * Math.PI
            );
            ctx.stroke();
        }else if(shape.type === "line"){
            ctx.beginPath();
            ctx.moveTo(shape.properties.startX,shape.properties.startY)
            ctx.lineTo(shape.properties.endX, shape.properties.endY)
            ctx.stroke();
        }else if(shape.type === "diamond"){
            ctx.beginPath();
            ctx.moveTo(shape.properties.x + shape.properties.width / 2, shape.properties.y);
            ctx.lineTo(shape.properties.x + shape.properties.width, shape.properties.y + shape.properties.height / 2);
            ctx.lineTo(shape.properties.x + shape.properties.width / 2, shape.properties.y + shape.properties.height);
            ctx.lineTo(shape.properties.x, shape.properties.y + shape.properties.height / 2);
            ctx.lineTo(shape.properties.x + shape.properties.width / 2, shape.properties.y );

            ctx.closePath();
            ctx.stroke();
        }else if(shape.type === "arrow"){
            ctx.beginPath();
            ctx.moveTo(shape.properties.startX, shape.properties.startY);
            ctx.lineTo(shape.properties.endX, shape.properties.endY);
            const headlen = 10; // length of head in pixels
            const angle = Math.atan2(shape.properties.endY - shape.properties.startY, shape.properties.endX - shape.properties.startX);
            ctx.lineTo(shape.properties.endX - headlen * Math.cos(angle - Math.PI / 6), shape.properties.endY - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(shape.properties.endX, shape.properties.endY);
            ctx.lineTo(shape.properties.endX - headlen * Math.cos(angle + Math.PI / 6), shape.properties.endY - headlen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }else if(shape.type === "text"){    
            ctx.font = "20px Arial";
            ctx.fillStyle = "rgba(255,255,255)";
            ctx.fillText(shape.properties.text, shape.properties.x, shape.properties.y);
        }
    });
}

function wsconnection(slug: string, canvas: HTMLCanvasElement) {
    if (sock) return;

    sock = new WebSocket(`${WS_URL}?token=${localStorage.getItem("token")}`);
    sock.onopen = () => sock?.send(JSON.stringify({ type: "join_room", slug }));
    sock.onclose = () => (sock = null);
    sock.onmessage = (event) => {
        const newShape = JSON.parse(event.data).shape;
        if (!newShape) return;

        existingShapes.push(newShape);
        clearCanvas(existingShapes, canvas);
    };
}

const sendShape = (message: any, slug: string) => {
    if (!sock) return;
    sock.send(
        JSON.stringify({
            type: "shape",
            data: message,
            slug,
        })
    );
};

export function Draw(canvas: HTMLCanvasElement, shapes: any[], slug: string, activated: string) {
    wsconnection(slug, canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    existingShapes = [...shapes];
    clearCanvas(existingShapes, canvas);

    let startX = 0;
    let startY = 0;

    // Cleanup previous listeners
    canvas.removeEventListener("mousedown", (canvas as any)._mouseDownHandler);
    canvas.removeEventListener("mousemove", (canvas as any)._mouseMoveHandler);
    canvas.removeEventListener("mouseup", (canvas as any)._mouseUpHandler);

    function handleMouseMove(e: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        const width = currentX - startX;
        const height = currentY - startY;
        if (!ctx) return;
        clearCanvas(existingShapes, canvas);
        ctx.strokeStyle = "rgba(255,255,255)";

        if (activated === "rect") {
            ctx.strokeRect(startX, startY, width, height);
        } else if (activated === "circle") {
            const radiusX = width / 2;
            const radiusY = height / 2;
            ctx.beginPath();
            ctx.ellipse(startX + radiusX, startY + radiusY, Math.abs(radiusX), Math.abs(radiusY), 0, 0, 2 * Math.PI);
            ctx.stroke();
        }else if(activated === 'line'){
            ctx.beginPath();
            ctx.moveTo(startX,startY);
            ctx.lineTo(currentX,currentY);
            ctx.stroke();
        }else if(activated === 'diamond'){
            ctx.beginPath();
            ctx.moveTo(startX + width / 2, startY);
            ctx.lineTo(startX + width, startY + height / 2);
            ctx.lineTo(startX + width / 2, startY + height);
            ctx.lineTo(startX, startY + height / 2);
            ctx.closePath();
            ctx.stroke();
        }else if(activated === 'arrow'){
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);
            const headlen = 10; // length of head in pixels
            const angle = Math.atan2(currentY - startY, currentX - startX);
            ctx.lineTo(currentX - headlen * Math.cos(angle - Math.PI / 6), currentY - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(currentX - headlen * Math.cos(angle + Math.PI / 6), currentY - headlen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }else if(activated === 'text'){
            ctx.font = "20px Arial";
            ctx.fillStyle = "rgba(255,255,255, 1)";
            ctx.fillText("Type here...", startX, startY);
        }
    }

    const handleMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;

        canvas.addEventListener("mousemove", handleMouseMove);
    };

    const handleMouseUp = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;
        const width = endX - startX;
        const height = endY - startY;

        let newShape;

        if (activated === "rect") {
            newShape = {
                type: "rect",
                properties: { x: startX, y: startY, width, height },
                userId: "me",
            };
        } else if (activated === "circle") {
            newShape = {
                type: "circle",
                properties: {
                    centerX: startX + width / 2,
                    centerY: startY + height / 2,
                    radiusX: width / 2,
                    radiusY: height / 2,
                },
                userId: "me",
            };
        }else if(activated === 'line'){
            newShape = {
                type: 'line',
                properties: {
                    startX,
                    startY,
                    endX,
                    endY
                },
                userId: 'me'
            }
        }else if(activated === 'diamond'){
            newShape = {
                type: 'diamond',
                properties: {
                    x: startX,
                    y: startY,
                    width,
                    height
                },
                userId: 'me'
            };
        }else if(activated === 'arrow'){
            newShape = {
                type: 'arrow',
                properties: {
                    startX,
                    startY,
                    endX,
                    endY
                },
                userId: 'me'
            };
        }else if(activated === 'text'){
            newShape = {
                type: 'text',
                properties: {
                    x: startX,
                    y: startY,
                    text: "Type here..."
                },
                userId: 'me'
            };
        }

        existingShapes.push(newShape);
        sendShape(newShape, slug);
        clearCanvas(existingShapes, canvas);

        canvas.removeEventListener("mousemove", handleMouseMove);
    };

    // Store references for future cleanup
    (canvas as any)._mouseDownHandler = handleMouseDown;
    (canvas as any)._mouseUpHandler = handleMouseUp;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
}

