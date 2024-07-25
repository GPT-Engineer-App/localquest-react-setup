import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  event_date: z.date().min(new Date(), "Event date must be in the future"),
  location: z.string().min(3, "Location must be at least 3 characters long"),
  category: z.string().min(1, "Please select a category"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const CreateEvent = () => {
  const [viewState, setViewState] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    zoom: 10
  });

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      latitude: viewState.latitude,
      longitude: viewState.longitude,
    },
  });

  const createEvent = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from("events").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event created successfully!");
    },
    onError: (error) => {
      toast.error(`Error creating event: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    createEvent.mutate({
      ...data,
      event_date: format(data.event_date, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    });
  };

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    setValue("latitude", lat);
    setValue("longitude", lng);
    setViewState({
      ...viewState,
      latitude: lat,
      longitude: lng,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="event_date">Event Date</Label>
              <Controller
                name="event_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    id="event_date"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
              {errors.event_date && <p className="text-red-500 text-sm">{errors.event_date.message}</p>}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} />
              {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select id="category" {...register("category")}>
                <option value="">Select a category</option>
                <option value="Music">Music</option>
                <option value="Sports">Sports</option>
                <option value="Art">Art</option>
                <option value="Technology">Technology</option>
                <option value="Food">Food</option>
              </Select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div>
              <Label>Select Location on Map</Label>
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                style={{width: "100%", height: 300}}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                onClick={handleMapClick}
              >
                <Marker
                  longitude={viewState.longitude}
                  latitude={viewState.latitude}
                  color="red"
                />
              </Map>
              <Input type="hidden" {...register("latitude")} />
              <Input type="hidden" {...register("longitude")} />
            </div>

            <Button type="submit" disabled={createEvent.isLoading}>
              {createEvent.isLoading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;