import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EventCard = ({ event }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">
          {format(new Date(event.event_date), 'PPP')}
        </p>
        <p className="mb-2">{event.location}</p>
        <Badge>{event.category}</Badge>
      </CardContent>
    </Card>
  );
};

export default EventCard;