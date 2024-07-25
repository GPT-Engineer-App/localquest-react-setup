import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const RecommendedEvents = () => {
  const { session } = useSupabaseAuth();

  const { data: userInterests, isLoading: interestsLoading } = useQuery({
    queryKey: ['userInterests', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from('user_interests')
        .select('interest')
        .eq('user_id', session.user.id);
      if (error) throw error;
      return data.map(item => item.interest);
    },
    enabled: !!session?.user?.id,
  });

  const { data: recommendedEvents, isLoading: eventsLoading, error } = useQuery({
    queryKey: ['recommendedEvents', userInterests],
    queryFn: async () => {
      if (!userInterests || userInterests.length === 0) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .in('category', userInterests)
        .order('event_date', { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!userInterests && userInterests.length > 0,
  });

  if (!session) {
    return <p>Please log in to see recommended events.</p>;
  }

  if (interestsLoading || eventsLoading) {
    return <p>Loading recommendations...</p>;
  }

  if (error) {
    return <p>Error loading recommendations: {error.message}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Events</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendedEvents && recommendedEvents.length > 0 ? (
          <ul>
            {recommendedEvents.map((event) => (
              <li key={event.id} className="mb-4">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">Category: {event.category}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommended events found based on your interests.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedEvents;