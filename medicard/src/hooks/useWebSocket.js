import { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const useWebSocket = () => {
    const [alerts, setAlerts] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const stompClientRef = useRef(null);
    const retryCount = useRef(0);
    const maxRetries = 3;

    const connectWebSocket = () => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';
        const socket = new SockJS(wsUrl);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, (frame) => {
            setIsConnected(true);
            setIsReconnecting(false);
            retryCount.current = 0;
            console.log('Connected to WebSocket:', frame);

            stompClient.subscribe('/topic/alerts', (message) => {
                let alertMessage;
                try {
                    alertMessage = JSON.parse(message.body);
                } catch {
                    alertMessage = message.body;
                }
                setAlerts((prev) => [...prev, alertMessage]);
            });

            stompClient.subscribe('/topic/scanner', (message) => {
                console.log('Scanner event:', message.body);
            });
        }, (error) => {
            console.error('WebSocket connection error:', error);
            setIsConnected(false);
            
            if (retryCount.current < maxRetries) {
                setIsReconnecting(true);
                retryCount.current += 1;
                setTimeout(connectWebSocket, 5000);
            } else {
                setIsReconnecting(false);
            }
        });

        stompClientRef.current = stompClient;
    };

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { alerts, isConnected, isReconnecting };
};
