import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const RecommendationReasons = () => {
  const { session } = useSupabaseAuth();

  const { data: recommendationReasons, isLoading, error } = useQuery({
    queryKey: ['recommendationReasons', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      // This is a placeholder query. In a real-world scenario, this would be replaced with a call to a recommendation explanation service.
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data.map(event => ({
        ...event,
        reason: 'Based on your interests and past event attendance',
      }));
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) return <div>Loading recommendation reasons...</div>;
  if (error) return <div>Error loading recommendation reasons: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Why We Recommend These Events</CardTitle>
      </CardHeader>
      <CardContent>
        {recommendationReasons && recommendationReasons.length > 0 ? (
          <ul className="space-y-4">
            {recommendationReasons.map(rec => (
              <li key={rec.id} className="border-b pb-4 last:border-b-0">
                <h4 className="font-medium">{rec.title}</h4>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                <p className="text-sm font-medium mt-2">Reason: {rec.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recommendation reasons available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendationReasons;