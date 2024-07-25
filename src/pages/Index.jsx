import React from 'react';
import { motion } from 'framer-motion';
import AdvancedSearch from '@/components/AdvancedSearch';
import RecommendedEvents from '@/components/RecommendedEvents';
import PopularEvents from '@/components/PopularEvents';
import RecommendationReasons from '@/components/RecommendationReasons';
import UserDiscovery from '@/components/UserDiscovery';
import Groups from '@/components/Groups';

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">Welcome to Event App</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search Events</h2>
        <AdvancedSearch />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
          <RecommendedEvents />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Popular Events</h2>
          <PopularEvents />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Why We Recommend These Events</h2>
        <RecommendationReasons />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Discover Users</h2>
        <UserDiscovery />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Interest Groups</h2>
        <Groups />
      </div>
    </motion.div>
  );
};

export default Index;