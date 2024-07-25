import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarIcon } from 'lucide-react';

const Reviews = ({ eventId }) => {
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['eventReviews', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_reviews')
        .select('*, user_profiles(full_name)')
        .eq('event_id', eventId);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews: {error.message}</div>;

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <StarIcon key={index} className={`h-4 w-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="border-b pb-4 last:border-b-0">
                <p className="font-semibold">{review.user_profiles.full_name}</p>
                <div className="flex space-x-4 my-2">
                  <div>
                    <p className="text-sm">Venue</p>
                    <div className="flex">{renderStars(review.venue)}</div>
                  </div>
                  <div>
                    <p className="text-sm">Organization</p>
                    <div className="flex">{renderStars(review.organization)}</div>
                  </div>
                  <div>
                    <p className="text-sm">Content</p>
                    <div className="flex">{renderStars(review.content)}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comments}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default Reviews;