import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PopularEvents = () => {
  const { data: popularEvents, isLoading, error } = useQuery({
    queryKey: ['popularEvents'],
    queryFn: async () => {
      // This is a placeholder query. In a real-world scenario, this would be replaced with a more sophisticated collaborative filtering algorithm.
      const { data, error } = await supabase
        .from('events')
        .select('*, event_attendees(count)')
        .order('event_attendees(count)', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading popular events...</div>;
  if (error) return <div>Error loading popular events: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Events</CardTitle>
      </CardHeader>
      <CardContent>
        {popularEvents && popularEvents.length > 0 ? (
          <ul className="space-y-2">
            {popularEvents.map(event => (
              <li key={event.id} className="border-b pb-2 last:border-b-0">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No popular events available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default PopularEvents;