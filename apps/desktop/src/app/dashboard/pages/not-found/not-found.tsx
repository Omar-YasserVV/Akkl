import { Link } from "react-router-dom";
import { Button } from "@heroui/react";
import { HiOutlineHome } from "react-icons/hi2";
import { IoHelpCircleOutline } from "react-icons/io5";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="h-[85vh] bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative rounded-xl overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/3 rounded-full blur-3xl -ml-48 -mb-48"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* 404 Heading */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="font-cherry text-9xl sm:text-[10rem] font-bold text-primary mb-2">
            404
          </h1>
          <p className="text-gray-400 text-lg tracking-widest uppercase font-medium">
            Page Not Found
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-3xl sm:text-4xl font-cherry font-bold text-gray-900 mb-4">
            This Recipe Has Expired
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
            The page you're looking for has been removed from our kitchen or the
            URL might be incorrect.
          </p>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center gap-3 my-10"
        >
          <div className="w-12 h-px bg-gray-200" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-12 h-px bg-gray-200" />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Button
            as={Link}
            to="/dashboard"
            size="lg"
            startContent={<HiOutlineHome className="text-xl" />}
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg px-6 h-12 transition-all duration-300"
          >
            Return to Dashboard
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="border-t border-gray-200 pt-8 text-center"
        >
          <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
            <IoHelpCircleOutline className="text-lg" />
            Need assistance?{" "}
            <Link
              to="#"
              className="text-primary hover:underline font-semibold transition-colors"
            >
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
