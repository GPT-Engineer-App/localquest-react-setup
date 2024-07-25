import { motion } from "framer-motion";

const CreateEvent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-4">Create a New Event</h1>
      <p className="text-lg text-muted-foreground">
        Share your event with the community.
      </p>
    </motion.div>
  );
};

export default CreateEvent;