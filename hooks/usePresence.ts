/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useBoardStore } from '@/store/board-store';
import { useAuth } from '@/components/providers/AuthProvider';
import { PresenceUser } from '@/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

function pickColor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = id.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}

export function usePresence(boardId: string) {
  const { user } = useAuth();
  const setOnlineUsers = useBoardStore((s) => s.setOnlineUsers);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!boardId || !user) return;

    const channel = supabase.channel(`presence-${boardId}`, {
      config: { presence: { key: user.id } },
    });
    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users: PresenceUser[] = Object.values(state)
          .flat()
          .map((p: any) => ({
            userId: p.userId,
            email: p.email,
            name: p.name,
            color: pickColor(p.userId),
          }));
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            userId: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email,
          });
        }
      });

    return () => {
      channelRef.current = null;
      supabase.removeChannel(channel);
    };
  }, [boardId, user, setOnlineUsers]);
}