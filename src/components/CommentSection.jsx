import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const CommentSection = ({ eventId }) => {
  const [comment, setComment] = useState('');
  const { session } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_comments')
        .select('*, user_profiles(full_name)')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addComment = useMutation({
    mutationFn: async (newComment) => {
      const { data, error } = await supabase
        .from('event_comments')
        .insert([{ event_id: eventId, user_id: session.user.id, content: newComment }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', eventId]);
      setComment('');
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      toast.error(`Error adding comment: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('You must be logged in to comment');
      return;
    }
    addComment.mutate(comment);
  };

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Comments</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button type="submit" disabled={!comment.trim() || addComment.isLoading}>
          {addComment.isLoading ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="bg-muted p-4 rounded-lg">
            <p className="font-semibold">{comment.user_profiles.full_name}</p>
            <p>{comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;