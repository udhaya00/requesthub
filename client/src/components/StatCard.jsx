import { motion } from "framer-motion";

const StatCard = ({ label, value, caption }) => (
  <motion.article
    className="stat-card"
    whileHover={{ y: -4 }}
    transition={{ type: "spring", stiffness: 280, damping: 20 }}
  >
    <span className="eyebrow">{label}</span>
    <strong>{value}</strong>
    <p>{caption}</p>
  </motion.article>
);

export default StatCard;

