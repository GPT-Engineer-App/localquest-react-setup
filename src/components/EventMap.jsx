import React, { useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';

const EventMap = ({ events }) => {
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 11
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: '100%', height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    >
      {events.map(event => (
        <Marker
          key={event.id}
          latitude={event.latitude}
          longitude={event.longitude}
          onClick={e => {
            e.originalEvent.stopPropagation();
            setSelectedEvent(event);
          }}
        >
          <Button variant="outline" size="icon">
            📍
          </Button>
        </Marker>
      ))}

      {selectedEvent && (
        <Popup
          latitude={selectedEvent.latitude}
          longitude={selectedEvent.longitude}
          onClose={() => setSelectedEvent(null)}
          closeOnClick={false}
        >
          <div>
            <h3>{selectedEvent.title}</h3>
            <p>{selectedEvent.description}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default EventMap;