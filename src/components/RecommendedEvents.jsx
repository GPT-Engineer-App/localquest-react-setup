import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const RecommendedEvents = () => {
  const { session } = useSupabaseAuth();

  const { data: recommendedEvents, isLoading, error } = useQuery({
    queryKey: ['recommendedEvents', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      // This is a placeholder query. In a real-world scenario, this would be replaced with a call to a machine learning service.
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) return <div>Loading recommended events...</div>;
  if (error) return <div>Error loading recommended events: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Events for You</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendedEvents && recommendedEvents.length > 0 ? (
          <ul className="space-y-2">
            {recommendedEvents.map(event => (
              <li key={event.id} className="border-b pb-2 last:border-b-0">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommended events available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedEvents;