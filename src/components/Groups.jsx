import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const Groups = () => {
  const [groupName, setGroupName] = useState('');
  const { session } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase.from('groups').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: userGroups, isLoading: userGroupsLoading } = useQuery({
    queryKey: ['userGroups'],
    queryFn: async () => {
      if (!session) return [];
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', session.user.id);
      if (error) throw error;
      return data.map(item => item.group_id);
    },
    enabled: !!session,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (name) => {
      const { data, error } = await supabase
        .from('groups')
        .insert({ name, created_by: session.user.id });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('groups');
      toast.success('Group created successfully!');
      setGroupName('');
    },
    onError: (error) => {
      toast.error(`Error creating group: ${error.message}`);
    },
  });

  const joinGroupMutation = useMutation({
    mutationFn: async (groupId) => {
      const { data, error } = await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: session.user.id });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries('userGroups');
      toast.success('Joined group successfully!');
    },
    onError: (error) => {
      toast.error(`Error joining group: ${error.message}`);
    },
  });

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      createGroupMutation.mutate(groupName.trim());
    }
  };

  const handleJoinGroup = (groupId) => {
    joinGroupMutation.mutate(groupId);
  };

  if (groupsLoading || userGroupsLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
            />
            <Button onClick={handleCreateGroup}>Create</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {groups && groups.map(group => (
            <div key={group.id} className="flex justify-between items-center mb-2">
              <span>{group.name}</span>
              {!userGroups.includes(group.id) && (
                <Button onClick={() => handleJoinGroup(group.id)}>Join</Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Groups</CardTitle>
        </CardHeader>
        <CardContent>
          {groups && groups
            .filter(group => userGroups.includes(group.id))
            .map(group => (
              <div key={group.id} className="mb-2">
                {group.name}
              </div>
            ))
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default Groups;