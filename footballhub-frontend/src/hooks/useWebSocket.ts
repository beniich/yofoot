import { useEffect, useRef, useState } from 'react';
import { isNative } from '../utils/platform';

export function useWebSocket(url: string) {
    const ws = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<any>(null);

    useEffect(() => {
        // Connect to WebSocket
        // Sur mobile (Capacitor), utiliser wss si HTTPS, sinon ws
        // En local, utiliser ws
        const protocol = isNative() || window.location.protocol === 'https:' ? 'wss' : 'ws';

        // Si l'URL commence déjà par ws:// ou wss://, l'utiliser telle quelle
        let wsUrl = url;
        if (url.startsWith('http')) {
            wsUrl = url.replace('http', 'ws');
        }

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
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [url]);

    const send = (data: any) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }
    };

    const subscribe = (channel: string) => {
        send({ type: 'subscribe', payload: { channel } });
    };

    const unsubscribe = (channel: string) => {
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
