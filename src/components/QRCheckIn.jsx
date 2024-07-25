import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { supabase } from '@/integrations/supabase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const QRCheckIn = () => {
  const [scanning, setScanning] = useState(false);
  const { session } = useSupabaseAuth();
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const handleScan = async (decodedText) => {
    setScanning(false);
    const url = new URL(decodedText);
    const eventId = url.pathname.split('/').pop();

    if (session && eventId) {
      try {
        const { error } = await supabase
          .from('event_attendees')
          .upsert({ 
            event_id: eventId, 
            user_id: session.user.id, 
            status: 'checked_in' 
          });

        if (error) throw error;
        toast.success('Check-in successful!');
      } catch (error) {
        console.error('Error during check-in:', error);
        toast.error('Check-in failed. Please try again.');
      }
    } else {
      toast.error('Invalid QR code or user not logged in');
    }
  };

  const startScanning = () => {
    setScanning(true);
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );
    scannerRef.current.render(handleScan, (error) => {
      console.error(error);
    });
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
    setScanning(false);
  };

  return (
    <div className="flex flex-col items-center">
      {scanning ? (
        <>
          <div id="qr-reader" style={{ width: '100%', maxWidth: '500px' }}></div>
          <Button onClick={stopScanning} className="mt-4">Stop Scanning</Button>
        </>
      ) : (
        <Button onClick={startScanning}>Start Scanning</Button>
      )}
    </div>
  );
};

export default QRCheckIn;