import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const QASection = ({ eventId }) => {
  const [question, setQuestion] = useState('');
  const { session } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_questions')
        .select('*, user_profiles(full_name)')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addQuestion = useMutation({
    mutationFn: async (newQuestion) => {
      const { data, error } = await supabase
        .from('event_questions')
        .insert([{ event_id: eventId, user_id: session.user.id, content: newQuestion }]);
      if (error) throw error;

      // Notify organizer (this should be implemented on the server-side in a real application)
      await supabase.functions.invoke('notifyOrganizer', {
        body: { eventId, questionId: data[0].id },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['questions', eventId]);
      setQuestion('');
      toast.success('Question submitted successfully');
    },
    onError: (error) => {
      toast.error(`Error submitting question: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('You must be logged in to ask a question');
      return;
    }
    addQuestion.mutate(question);
  };

  if (isLoading) return <div>Loading Q&A...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Q&A</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />
        <Button type="submit" disabled={!question.trim() || addQuestion.isLoading}>
          {addQuestion.isLoading ? 'Submitting...' : 'Submit Question'}
        </Button>
      </form>
      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q.id} className="bg-muted p-4 rounded-lg">
            <p className="font-semibold">{q.user_profiles.full_name}</p>
            <p>{q.content}</p>
            {q.answer && (
              <div className="mt-2 pl-4 border-l-2 border-primary">
                <p className="font-semibold">Answer:</p>
                <p>{q.answer}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QASection;