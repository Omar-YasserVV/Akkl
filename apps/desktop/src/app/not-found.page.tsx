import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { HiOutlineHome } from "react-icons/hi2";
import { IoHelpCircleOutline } from "react-icons/io5";
import { motion, Variants } from "framer-motion";

// 1. Define simple variants for the whole container
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1, // Elements will pop in one after another
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function NotFound() {
  return (
    <main className="h-[85vh] flex flex-col items-center justify-center px-4 relative rounded-xl overflow-hidden">
      {/* Subtle Background - simplified to a single fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 pointer-events-none bg-radial-gradient from-primary/5 to-transparent"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl text-center"
      >
        {/* Each child now just needs the "itemVariants" */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="font-cherry text-9xl sm:text-[10rem] font-bold text-primary mb-2">
            404
          </h1>
          <p className="text-gray-400 text-lg tracking-widest uppercase font-medium">
            Page Not Found
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <h2 className="text-3xl sm:text-4xl font-cherry font-bold text-gray-900 mb-4">
            This Recipe Has Expired
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            The page you're looking for has been removed from our kitchen or the
            URL might be incorrect.
          </p>
        </motion.div>

        {/* Simplified decorative line */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 my-10"
        >
          <div className="w-12 h-px bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-12 h-px bg-gray-200" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-12"
        >
          <Button
            as={Link}
            to="/dashboard"
            size="lg"
            startContent={<HiOutlineHome className="text-xl" />}
            className="bg-primary hover:scale-105 active:scale-95 text-white font-semibold rounded-lg px-8 h-12 transition-transform"
          >
            Return to Dashboard
          </Button>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="border-t border-gray-200 pt-8 text-center"
        >
          <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <IoHelpCircleOutline className="text-lg" />
            Need assistance?{" "}
            <Link to="#" className="text-primary hover:underline font-semibold">
              Contact support
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
