import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const reviewSchema = z.object({
  venue: z.number().min(1).max(5),
  organization: z.number().min(1).max(5),
  content: z.number().min(1).max(5),
  comments: z.string().max(500, 'Comments must be less than 500 characters'),
});

const ReviewForm = ({ eventId }) => {
  const { session } = useSupabaseAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data) => {
    if (!session) {
      toast.error('You must be logged in to submit a review');
      return;
    }

    try {
      const { error } = await supabase.from('event_reviews').insert({
        event_id: eventId,
        user_id: session.user.id,
        ...data,
      });

      if (error) throw error;
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {['venue', 'organization', 'content'].map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="capitalize">{field} Rating</Label>
              <Input
                id={field}
                type="number"
                {...register(field, { valueAsNumber: true })}
                min="1"
                max="5"
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field].message}</p>}
            </div>
          ))}
          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea id="comments" {...register('comments')} />
            {errors.comments && <p className="text-red-500 text-sm">{errors.comments.message}</p>}
          </div>
          <Button type="submit">Submit Review</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;