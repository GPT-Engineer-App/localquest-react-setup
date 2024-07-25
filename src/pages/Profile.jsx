import { motion } from "framer-motion";

const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-4">Your Profile</h1>
      <p className="text-lg text-muted-foreground">
        Manage your account and view your event history.
      </p>
    </motion.div>
  );
};

export default Profile;