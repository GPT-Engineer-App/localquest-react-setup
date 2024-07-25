import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

const Events = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />
    </div>
  );
};

export default Events;