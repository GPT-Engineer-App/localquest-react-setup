import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['eventSearch', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .textSearch('fts', searchTerm);
      if (error) throw error;
      return data;
    },
    enabled: !!searchTerm,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    // The search will be triggered automatically by react-query when searchTerm changes
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events..."
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
        {isLoading && <p>Searching...</p>}
        {error && <p>Error: {error.message}</p>}
        {searchResults && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
            {searchResults.length === 0 ? (
              <p>No results found.</p>
            ) : (
              <ul>
                {searchResults.map((event) => (
                  <li key={event.id} className="mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Search;