import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import TechStack from "../components/TechStack";
import Project from "../components/Project";
import Profile from "../components/Profile";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.7,
        ease: "easeInOut",
      }}
    >
      <Navbar />
      <Profile />
      <TechStack />
      <Project />
      <Footer />
    </motion.div>
  );
}
