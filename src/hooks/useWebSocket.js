import { useEffect, useRef, useState } from 'react';

export function useWebSocket(url) {
    const ws = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);

    useEffect(() => {
        // Determine protocol
        const wsUrl = url.replace('http://', 'ws://').replace('https://', 'wss://');

        const connect = () => {
            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log('✅ WebSocket connected');
                setIsConnected(true);
            };

            ws.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setLastMessage(data);
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };

            ws.current.onclose = () => {
                console.log('❌ WebSocket disconnected');
                setIsConnected(false);
                // Optional: Reconnect logic
                // setTimeout(connect, 5000);
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        };

        connect();

        // Cleanup
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [url]);

    const send = (data) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    };

    const subscribe = (channel) => {
        send({ type: 'subscribe', payload: { channel } });
    };

    const unsubscribe = (channel) => {
        send({ type: 'unsubscribe', payload: { channel } });
    };

    return {
        isConnected,
        lastMessage,
        send,
        subscribe,
        unsubscribe,
    };
}
