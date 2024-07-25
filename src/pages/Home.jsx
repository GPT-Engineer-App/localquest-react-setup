import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-4">Welcome to Event App</h1>
      <p className="text-lg text-muted-foreground">
        Discover and create amazing events in your area.
      </p>
    </motion.div>
  );
};

export default Home;