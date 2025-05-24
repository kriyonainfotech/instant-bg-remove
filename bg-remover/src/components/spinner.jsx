import { motion } from "framer-motion";

export const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1 }}
    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
  />
);
