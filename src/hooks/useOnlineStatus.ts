
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOnlineStatus = () => {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSeen, setLastSeen] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const updateUserStatus = async (status: 'online' | 'offline') => {
      try {
        const updates: any = {
          last_seen: new Date().toISOString()
        };
        
        // Update online status
        if (status === 'online') {
          updates.is_online = true;
        } else {
          updates.is_online = false;
        }

        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
      } catch (error) {
        console.error('Failed to update user status:', error);
      }
    };

    // Update status when component mounts
    updateUserStatus(isOnline ? 'online' : 'offline');

    // Update status when online/offline changes
    if (isOnline) {
      updateUserStatus('online');
    } else {
      updateUserStatus('offline');
      setLastSeen(new Date());
    }

    // Set up periodic updates when online
    let interval: NodeJS.Timeout;
    if (isOnline) {
      interval = setInterval(() => {
        updateUserStatus('online');
      }, 30000); // Update every 30 seconds
    }

    // Cleanup on unmount or when going offline
    return () => {
      if (interval) clearInterval(interval);
      if (user) {
        updateUserStatus('offline');
      }
    };
  }, [user, isOnline]);

  return {
    isOnline,
    lastSeen
  };
};

export const useUserOnlineStatus = (userId: string) => {
  const [userStatus, setUserStatus] = useState<{
    isOnline: boolean;
    lastSeen: string | null;
  }>({ isOnline: false, lastSeen: null });

  useEffect(() => {
    if (!userId) return;

    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_online, last_seen')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (data) {
          setUserStatus({
            isOnline: data.is_online || false,
            lastSeen: data.last_seen
          });
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error);
      }
    };

    fetchUserStatus();

    // Set up real-time subscription
    const channel = supabase
      .channel('user-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          if (payload.new) {
            setUserStatus({
              isOnline: (payload.new as any).is_online || false,
              lastSeen: (payload.new as any).last_seen
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return userStatus;
};
