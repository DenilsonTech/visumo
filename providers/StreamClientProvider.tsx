"use client"

import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useMemo } from 'react';
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  
  const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoaded } = useUser();

  const videoClient = useMemo(() => {
      if (!isLoaded || !user) return undefined;
      if (!apiKey) throw new Error('Stream API is missing');

      return new StreamVideoClient({
        apiKey,
        user: {
          id: user.id,
          name: user.username || user.id,
          image: user.imageUrl,
        },
        tokenProvider: async () => {
          const response = await fetch('/api/stream/token', {
            method: 'GET',
            cache: 'no-store',
          });

          if (!response.ok) {
            throw new Error('Failed to fetch Stream token');
          }

          const data = await response.json();
          return data.token as string;
        },
      });
    }, [isLoaded, user]);

    useEffect(() => {
      return () => {
        videoClient?.disconnectUser?.();
      };
    }, [videoClient]);

    if(!videoClient) return <Loader/>

    return (
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
  };

  export default StreamVideoProvider;
