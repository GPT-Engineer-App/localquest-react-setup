import React from 'react';
import QRCode from 'qrcode.react';

const EventQRCode = ({ eventId }) => {
  const eventUrl = `${window.location.origin}/event/checkin/${eventId}`;

  return (
    <div className="flex flex-col items-center">
      <QRCode value={eventUrl} size={256} />
      <p className="mt-2 text-sm text-muted-foreground">Scan to check in</p>
    </div>
  );
};

export default EventQRCode;