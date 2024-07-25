import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Notification = ({ message, type = 'info' }) => {
  React.useEffect(() => {
    toast[type](message, {
      duration: 3000,
      position: 'top-right',
    });
  }, [message, type]);

  return null;
};

export const NotificationWrapper = ({ children }) => (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default Notification;