import React from 'react';
import { motion } from 'framer-motion';
import AdvancedSearch from '@/components/AdvancedSearch';
import RecommendedEvents from '@/components/RecommendedEvents';
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
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
        <RecommendedEvents />
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