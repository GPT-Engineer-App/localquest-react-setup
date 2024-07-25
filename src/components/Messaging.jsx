import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const Messaging = ({ eventId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { session } = useSupabaseAuth();
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('event_messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel(`event_messages:${eventId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'event_messages' }, payload => {
        setMessages(currentMessages => [...currentMessages, payload.new]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [eventId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !session) return;

    const { error } = await supabase
      .from('event_messages')
      .insert({
        event_id: eventId,
        user_id: session.user.id,
        content: message.trim(),
      });

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setMessage('');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Event Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4" ref={scrollAreaRef}>
          {messages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>{msg.user_id}: </strong>
              {msg.content}
            </div>
          ))}
        </ScrollArea>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Messaging;