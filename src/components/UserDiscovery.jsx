import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const UserDiscovery = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    name: '',
    interest: '',
    location: '',
  });
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['discoverUsers', searchCriteria],
    queryFn: async () => {
      let query = supabase.from('user_profiles').select('*');
      
      if (searchCriteria.name) {
        query = query.ilike('full_name', `%${searchCriteria.name}%`);
      }
      if (searchCriteria.interest) {
        query = query.eq('interests', searchCriteria.interest);
      }
      if (searchCriteria.location) {
        query = query.eq('location', searchCriteria.location);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: Object.values(searchCriteria).some(Boolean),
  });

  const followMutation = useMutation({
    mutationFn: async (userId) => {
      const { data, error } = await supabase
        .from('user_follows')
        .insert({ follower_id: supabase.auth.user().id, following_id: userId });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('discoverUsers');
      toast.success('User followed successfully!');
    },
    onError: (error) => {
      toast.error(`Error following user: ${error.message}`);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // The search will be triggered automatically by react-query when searchCriteria changes
  };

  const handleFollow = (userId) => {
    followMutation.mutate(userId);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="space-y-2">
        <Input
          placeholder="Search by name"
          value={searchCriteria.name}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, name: e.target.value })}
        />
        <Select
          value={searchCriteria.interest}
          onValueChange={(value) => setSearchCriteria({ ...searchCriteria, interest: value })}
        >
          <option value="">Select an interest</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Art">Art</option>
          <option value="Technology">Technology</option>
        </Select>
        <Input
          placeholder="Location"
          value={searchCriteria.location}
          onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
        />
        <Button type="submit">Search</Button>
      </form>

      {isLoading && <p>Searching for users...</p>}
      {error && <p>Error: {error.message}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users && users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{user.bio}</p>
              <p>Interests: {user.interests.join(', ')}</p>
              <p>Location: {user.location}</p>
              <Button onClick={() => handleFollow(user.id)}>Follow</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserDiscovery;