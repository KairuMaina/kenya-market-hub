
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      // Since we don't have an events table yet, return empty array
      // This will be populated when events table is created
      return [];
    }
  });
};

export const useEventCategories = () => {
  return useQuery({
    queryKey: ['event-categories'],
    queryFn: async () => {
      // Return basic categories until events table is implemented
      return [
        { id: 'all', name: 'All Events', count: 0 },
        { id: 'concerts', name: 'Concerts', count: 0 },
        { id: 'comedy', name: 'Comedy Shows', count: 0 },
        { id: 'conferences', name: 'Conferences', count: 0 },
        { id: 'workshops', name: 'Workshops', count: 0 },
        { id: 'sports', name: 'Sports', count: 0 },
        { id: 'festivals', name: 'Festivals', count: 0 }
      ];
    }
  });
};
