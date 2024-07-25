import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const PhotoGallery = ({ eventId }) => {
  const [photo, setPhoto] = useState(null);
  const { session } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ['photos', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId);
      if (error) throw error;
      return data;
    },
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `event-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('event_photos')
        .insert([{ event_id: eventId, user_id: session.user.id, photo_url: filePath }]);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['photos', eventId]);
      setPhoto(null);
      toast.success('Photo uploaded successfully');
    },
    onError: (error) => {
      toast.error(`Error uploading photo: ${error.message}`);
    },
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('You must be logged in to upload photos');
      return;
    }
    if (photo) {
      uploadPhoto.mutate(photo);
    }
  };

  if (isLoading) return <div>Loading photos...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Photo Gallery</h2>
      <form onSubmit={handleUpload} className="space-y-2">
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <Button type="submit" disabled={!photo || uploadPhoto.isLoading}>
          {uploadPhoto.isLoading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={`${import.meta.env.VITE_SUPABASE_PROJECT_URL}/storage/v1/object/public/event-photos/${photo.photo_url}`}
            alt="Event"
            className="w-full h-48 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;