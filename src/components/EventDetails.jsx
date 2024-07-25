import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const EventDetails = ({ event }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {format(new Date(event.event_date), 'PPP')}
        </p>
        <p className="mb-4">{event.description}</p>
        <p className="mb-4">
          <strong>Location:</strong> {event.location}
        </p>
        <Badge className="mb-4">{event.category}</Badge>
        <p className="text-sm text-muted-foreground">
          Created by: {event.created_by}
        </p>
      </CardContent>
    </Card>
  );
};

export default EventDetails;