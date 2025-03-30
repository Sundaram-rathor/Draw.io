'use client'
import Bubbl from "@repo/ui/components/Bubble"
import ShareIcon from "@repo/ui/icons/ShareIcon"
import Dots from "@repo/ui/icons/Dots"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { BACKEND_URL, WS_URL } from "@repo/backend-common/config"

export default function Page({ slug }: { slug: string }) {
    const [message, setMessage] = useState('');
    const [oldMessages, setOldMessages] = useState<any[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [roomOwner,setRoomOwner] = useState('')

    // Scroll to latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = () => {
        if (!socket) {
            console.log('Socket not connected');
            return;
        }

        const chat = {
            type: "chat",
            slug: slug,
            message: message
        };


        // Send message via WebSocket
        socket.send(JSON.stringify(chat));
        setMessage(''); // Clear input field
        scrollToBottom();
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/room/${slug}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (response.data.success) {
                    setOldMessages(response.data.data.reverse()); // Reverse messages order
                    setRoomOwner(response.data.adminId)
                    console.log("Fetched messages:", response.data.data);
                    scrollToBottom(); // Auto-scroll after setting messages
                } else {
                    console.log(response.data);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem('token')}`);

        ws.onopen = () => {
            console.log('WebSocket connected');
            ws.send(JSON.stringify({ type: "join_room", slug: slug }));
        };

        ws.onmessage = (event) => {
            console.log('New message:', event.data);
            try {
                const newMessage = JSON.parse(event.data);
                setOldMessages((prevMessages) => [...prevMessages, newMessage]); // Append new message
                scrollToBottom();
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        setSocket(ws);
        fetchMessages();

        return () => {
            ws.send(JSON.stringify({ type: "leave_room", slug: slug }));
            ws.close();
        };
    }, [slug]);

    useEffect(() => {
        scrollToBottom();
    }, [oldMessages]); // Auto-scroll when messages update

    return (
        <div style={{ height: '100vh', width: '77vw', backgroundColor: '#121212', padding: '10px 10px' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                height: '5vh',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 20px',
                borderBottom: '1px solid #262626'
            }}>
                <div>{slug}</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Bubbl icon={<ShareIcon />} text="Share" />
                    <Bubbl icon={<Dots />} text="Option" />
                </div>
            </div>

            {/* Chat Messages */}
            <div style={{
                padding: '30px 20px',
                display: 'flex',
                flexDirection: 'column',
                height: '80vh',
                overflowY: 'auto',
                alignItems: 'flex-start',
            }}>
                {oldMessages.map((msg, index) => (
                    <div key={index} style={{
                        backgroundColor: msg.userId != roomOwner ? "#303030" : "#F0BB78",
                        padding: "10px",
                        borderRadius: "10px",
                        margin: "5px 0",
                        maxWidth: "70%",
                        alignSelf: msg.userId == roomOwner ? "flex-end" : "flex-start",
                        color: msg.userId != roomOwner ? "white" : "black",
                    }}>
                        {msg.message}
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Auto-scroll target */}
            </div>

            {/* Message Input Box */}
            <div style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "50%",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                backgroundColor: "#303030",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        flex: 1,
                        padding: "10px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: "#303030",
                        color: "white",
                        fontSize: "16px",
                        outline: "none",
                    }}
                />
                <button
                    style={{
                        marginLeft: "10px",
                        padding: "10px 15px",
                        border: "none",
                        borderRadius: "5px",
                        backgroundColor: 'whitesmoke',
                        color: "black",
                        cursor: "pointer",
                        fontSize: "16px",
                    }}
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
