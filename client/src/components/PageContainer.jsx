import { motion } from "framer-motion";

const PageContainer = ({ children }) => (
  <motion.section
    className="page-container"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.24, ease: "easeOut" }}
  >
    {children}
  </motion.section>
);

export default PageContainer;

