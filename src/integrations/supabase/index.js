import { createClient } from '@supabase/supabase-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});
export function SupabaseProvider({ children }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
}

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/* supabase integration types

### user_profiles

| name       | type        | format | required |
|------------|-------------|--------|----------|
| id         | uuid        | string | true     |
| full_name  | text        | string | false    |
| bio        | text        | string | false    |
| avatar_url | text        | string | false    |
| updated_at | timestamptz | string | false    |

### event_attendees

| name     | type | format | required |
|----------|------|--------|----------|
| id       | uuid | string | true     |
| event_id | uuid | string | false    |
| user_id  | uuid | string | false    |
| status   | text | string | false    |

### events

| name        | type        | format | required |
|-------------|-------------|--------|----------|
| id          | uuid        | string | true     |
| title       | text        | string | true     |
| description | text        | string | false    |
| event_date  | timestamptz | string | true     |
| location    | text        | string | false    |
| category    | text        | string | false    |
| created_by  | uuid        | string | false    |
| created_at  | timestamptz | string | false    |
| updated_at  | timestamptz | string | false    |
| fts         | tsvector    | string | false    |
| price       | numeric     | number | false    |
| accessibility_features | text[]   | array  | false    |

### user_interests

| name     | type | format | required |
|----------|------|--------|----------|
| id       | uuid | string | true     |
| user_id  | uuid | string | false    |
| interest | text | string | true     |

*/

// User Profiles
export const useUserProfiles = () => useQuery({
    queryKey: ['userProfiles'],
    queryFn: () => fromSupabase(supabase.from('user_profiles').select('*'))
});

export const useUserProfile = (id) => useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fromSupabase(supabase.from('user_profiles').select('*').eq('id', id).single())
});

export const useAddUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newProfile) => fromSupabase(supabase.from('user_profiles').insert([newProfile])),
        onSuccess: () => {
            queryClient.invalidateQueries('userProfiles');
        },
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_profiles').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('userProfiles');
        },
    });
};

export const useDeleteUserProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_profiles').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('userProfiles');
        },
    });
};

// Event Attendees
export const useEventAttendees = () => useQuery({
    queryKey: ['eventAttendees'],
    queryFn: () => fromSupabase(supabase.from('event_attendees').select('*'))
});

export const useEventAttendee = (id) => useQuery({
    queryKey: ['eventAttendee', id],
    queryFn: () => fromSupabase(supabase.from('event_attendees').select('*').eq('id', id).single())
});

export const useAddEventAttendee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newAttendee) => fromSupabase(supabase.from('event_attendees').insert([newAttendee])),
        onSuccess: () => {
            queryClient.invalidateQueries('eventAttendees');
        },
    });
};

export const useUpdateEventAttendee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('event_attendees').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('eventAttendees');
        },
    });
};

export const useDeleteEventAttendee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('event_attendees').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('eventAttendees');
        },
    });
};

// Events
export const useEvents = () => useQuery({
    queryKey: ['events'],
    queryFn: () => fromSupabase(supabase.from('events').select('*'))
});

export const useEvent = (id) => useQuery({
    queryKey: ['event', id],
    queryFn: () => fromSupabase(supabase.from('events').select('*').eq('id', id).single())
});

export const useAddEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newEvent) => fromSupabase(supabase.from('events').insert([newEvent])),
        onSuccess: () => {
            queryClient.invalidateQueries('events');
        },
    });
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('events').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('events');
        },
    });
};

export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('events').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('events');
        },
    });
};

// User Interests
export const useUserInterests = () => useQuery({
    queryKey: ['userInterests'],
    queryFn: () => fromSupabase(supabase.from('user_interests').select('*'))
});

export const useUserInterest = (id) => useQuery({
    queryKey: ['userInterest', id],
    queryFn: () => fromSupabase(supabase.from('user_interests').select('*').eq('id', id).single())
});

export const useAddUserInterest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newInterest) => fromSupabase(supabase.from('user_interests').insert([newInterest])),
        onSuccess: () => {
            queryClient.invalidateQueries('userInterests');
        },
    });
};

export const useUpdateUserInterest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('user_interests').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('userInterests');
        },
    });
};

export const useDeleteUserInterest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('user_interests').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries('userInterests');
        },
    });
};

// Real-time subscriptions
export const useRealTimeEvents = () => {
    const queryClient = useQueryClient();

    React.useEffect(() => {
        const subscription = supabase
            .channel('events')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
                queryClient.invalidateQueries('events');
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [queryClient]);

    return useEvents();
};