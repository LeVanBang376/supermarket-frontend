'use client';

import { useEffect, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface UseOrderWebSocketOptions {
  onOrderUpdated: (orderId: string) => void;
}

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected';

export function useOrderWebSocket({
  onOrderUpdated,
}: UseOrderWebSocketOptions) {
  const [status, setStatus] = useState<WebSocketStatus>(
    API_BASE_URL ? 'connecting' : 'disconnected',
  );

  useEffect(() => {
    if (!API_BASE_URL) {
      return;
    }

    const wsUrl = API_BASE_URL.replace(/^http/, 'ws');

    const socket = new WebSocket(`${wsUrl}/ws?service_type=customer_display`);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setStatus('connected');
    };

    socket.onmessage = (event) => {
      console.log('WebSocket message:', event.data);

      const message = JSON.parse(event.data);

      if (message.type === 'ORDER_UPDATED') {
        onOrderUpdated(message.order_id);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket disconnected');
      console.log('code:', event.code);
      console.log('reason:', event.reason);

      setStatus('disconnected');
    };

    return () => {
      socket.close();
    };
  }, [onOrderUpdated]);

  return {
    status,
  };
}
