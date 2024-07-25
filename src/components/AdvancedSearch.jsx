import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { debounce } from 'lodash';

const AdvancedSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [accessibilityFeatures, setAccessibilityFeatures] = useState([]);
  const [filters, setFilters] = useState({});

  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
  }, 300);

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm, filters],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select('*')
        .textSearch('fts', searchTerm, {
          type: 'websearch',
          config: 'english'
        });

      if (filters.eventType) {
        query = query.eq('category', filters.eventType);
      }
      if (filters.priceRange) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }
      if (filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0) {
        query = query.contains('accessibility_features', filters.accessibilityFeatures);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!searchTerm || Object.keys(filters).length > 0,
  });

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('searchFilters')) || {};
    setFilters(savedFilters);
    setEventType(savedFilters.eventType || '');
    setPriceRange(savedFilters.priceRange || [0, 1000]);
    setAccessibilityFeatures(savedFilters.accessibilityFeatures || []);
  }, []);

  const handleSearch = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = () => {
    const newFilters = {
      eventType,
      priceRange,
      accessibilityFeatures,
    };
    setFilters(newFilters);
    localStorage.setItem('searchFilters', JSON.stringify(newFilters));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search events..."
            onChange={handleSearch}
            className="w-full"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={eventType}
              onValueChange={(value) => {
                setEventType(value);
                handleFilterChange();
              }}
            >
              <option value="">All Event Types</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Art">Art</option>
              <option value="Technology">Technology</option>
            </Select>
            <div>
              <label className="text-sm font-medium">Price Range</label>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value);
                  handleFilterChange();
                }}
                className="mt-2"
              />
              <div className="flex justify-between mt-1">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Accessibility Features</label>
              <div className="space-y-2 mt-2">
                {['Wheelchair Access', 'Sign Language', 'Audio Description'].map((feature) => (
                  <div key={feature} className="flex items-center">
                    <Checkbox
                      id={feature}
                      checked={accessibilityFeatures.includes(feature)}
                      onCheckedChange={(checked) => {
                        const updatedFeatures = checked
                          ? [...accessibilityFeatures, feature]
                          : accessibilityFeatures.filter((f) => f !== feature);
                        setAccessibilityFeatures(updatedFeatures);
                        handleFilterChange();
                      }}
                    />
                    <label htmlFor={feature} className="ml-2 text-sm">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {isLoading && <p>Searching...</p>}
        {error && <p>Error: {error.message}</p>}
        {searchResults && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
            {searchResults.length === 0 ? (
              <p>No results found.</p>
            ) : (
              <ul className="space-y-2">
                {searchResults.map((event) => (
                  <li key={event.id} className="border-b pb-2">
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

export default AdvancedSearch;