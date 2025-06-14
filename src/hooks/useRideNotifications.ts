
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bell, Car, CheckCircle, XCircle, Clock } from 'lucide-react';

export const useRideNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Listen for ride status updates
    const rideChannel = supabase
      .channel('ride-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const { new: newRide, old: oldRide } = payload;
          
          if (newRide.status !== oldRide.status) {
            handleRideStatusChange(newRide.status, newRide, oldRide);
          }
        }
      )
      .subscribe();

    // Listen for driver ride requests (for drivers)
    const driverRequestChannel = supabase
      .channel('driver-requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'driver_ride_requests'
        },
        async (payload) => {
          const request = payload.new;
          
          // Check if this request is for the current driver
          const { data: driverData } = await supabase
            .from('drivers')
            .select('id')
            .eq('user_id', user.id)
            .eq('id', request.driver_id)
            .single();

          if (driverData) {
            // Get ride details
            const { data: rideData } = await supabase
              .from('rides')
              .select('pickup_address, estimated_fare, vehicle_type')
              .eq('id', request.ride_id)
              .single();

            if (rideData) {
              toast({
                title: '🚗 New Ride Request!',
                description: `${rideData.pickup_address} - KSh ${rideData.estimated_fare}`,
                duration: 10000,
              });

              // Play notification sound
              playNotificationSound();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(rideChannel);
      supabase.removeChannel(driverRequestChannel);
    };
  }, [user, toast]);

  const handleRideStatusChange = (newStatus: string, newRide: any, oldRide: any) => {
    const statusMessages = {
      accepted: {
        title: '✅ Driver Found!',
        description: 'Your driver is on the way to pick you up',
        icon: Car
      },
      in_progress: {
        title: '🚗 Trip Started!',
        description: 'You are now on your way to your destination',
        icon: Car
      },
      completed: {
        title: '🎉 Trip Completed!',
        description: `Trip completed successfully. Fare: KSh ${newRide.actual_fare || newRide.estimated_fare}`,
        icon: CheckCircle
      },
      cancelled: {
        title: '❌ Trip Cancelled',
        description: newRide.cancellation_reason || 'Your trip has been cancelled',
        icon: XCircle
      }
    };

    const statusInfo = statusMessages[newStatus as keyof typeof statusMessages];
    
    if (statusInfo) {
      toast({
        title: statusInfo.title,
        description: statusInfo.description,
        duration: 8000,
      });

      playNotificationSound();
    }
  };

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };
};
