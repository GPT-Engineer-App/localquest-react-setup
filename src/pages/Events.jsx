import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, isSameDay } from 'date-fns';
import EventList from '@/components/EventList';
import EventCard from '@/components/EventCard';
import EventMap from '@/components/EventMap';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { useRealTimeEvents } from '@/integrations/supabase';
import { NotificationWrapper } from '@/components/Notification';
import SocialShare from '@/components/SocialShare';
import Messaging from '@/components/Messaging';
import CommentSection from '@/components/CommentSection';
import PhotoGallery from '@/components/PhotoGallery';
import QASection from '@/components/QASection';

const Events = () => {
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({
    category: '',
    date: null,
    distance: '',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events, isLoading, error } = useRealTimeEvents();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredEvents = events?.filter(event => {
    if (filters.category && event.category !== filters.category) return false;
    if (filters.date && !isSameDay(parseISO(event.event_date), filters.date)) return false;
    // Note: Distance filtering would require geolocation data, which is not implemented in this example
    return true;
  });

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
  };

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error loading events: {error.message}</div>;

  return (
    <NotificationWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <div className="mb-6 flex space-x-4">
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <option value="">All Categories</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Art">Art</option>
            {/* Add more categories as needed */}
          </Select>
          <DatePicker
            selected={filters.date}
            onChange={(date) => handleFilterChange('date', date)}
          />
          <Input
            type="number"
            placeholder="Distance (km)"
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Button onClick={() => setView('list')} variant={view === 'list' ? 'default' : 'outline'} className="mr-2">
            List View
          </Button>
          <Button onClick={() => setView('grid')} variant={view === 'grid' ? 'default' : 'outline'} className="mr-2">
            Grid View
          </Button>
          <Button onClick={() => setView('map')} variant={view === 'map' ? 'default' : 'outline'}>
            Map View
          </Button>
        </div>
        {view === 'list' && <EventList events={filteredEvents} onEventSelect={handleEventSelect} />}
        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} onClick={() => handleEventSelect(event)} />
            ))}
          </div>
        )}
        {view === 'map' && <EventMap events={filteredEvents} onEventSelect={handleEventSelect} />}

        {selectedEvent && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
            <p>{selectedEvent.description}</p>
            <p>Date: {format(parseISO(selectedEvent.event_date), 'PPP')}</p>
            <p>Location: {selectedEvent.location}</p>
            <div className="mt-4">
              <SocialShare
                url={`${window.location.origin}/events/${selectedEvent.id}`}
                title={`Check out this event: ${selectedEvent.title}`}
              />
            </div>
            <div className="mt-8">
              <Messaging eventId={selectedEvent.id} />
            </div>
            <div className="mt-8">
              <CommentSection eventId={selectedEvent.id} />
            </div>
            <div className="mt-8">
              <PhotoGallery eventId={selectedEvent.id} />
            </div>
            <div className="mt-8">
              <QASection eventId={selectedEvent.id} />
            </div>
          </div>
        )}
      </motion.div>
    </NotificationWrapper>
  );
};

export default Events;