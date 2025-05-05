'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SplitScreenOnboarding = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Welcome to Turf",
      description: "A platform for focused debates and meaningful conversations.",
      color: "#4f46e5", // Indigo
      bgPattern: "radial-gradient(circle at 80% 50%, rgba(79, 70, 229, 0.7) 0%, rgba(67, 56, 202, 0.7) 50%, rgba(55, 48, 163, 0.8) 100%)"
    },
    {
      title: "Daily Topics",
      description: "Engage in carefully selected topics that inspire quality discussions.",
      color: "#0ea5e9", // Sky blue
      bgPattern: "radial-gradient(circle at 20% 70%, rgba(14, 165, 233, 0.7) 0%, rgba(2, 132, 199, 0.7) 50%, rgba(3, 105, 161, 0.8) 100%)"
    },
    {
      title: "Earn Recognition",
      description: "Get rewarded for thoughtful contributions and insights.",
      color: "#f59e0b", // Amber
      bgPattern: "radial-gradient(circle at 60% 30%, rgba(245, 158, 11, 0.7) 0%, rgba(217, 119, 6, 0.7) 50%, rgba(180, 83, 9, 0.8) 100%)"
    },
    {
      title: "Join the Community",
      description: "Connect with people who love intellectual discourse.",
      color: "#10b981", // Emerald
      bgPattern: "radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.7) 0%, rgba(5, 150, 105, 0.7) 50%, rgba(4, 120, 87, 0.8) 100%)"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push('/chat');
    }
  };

  const handleSkip = () => {
    router.push('/chat');
  };

  // Slide transition variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Content Side */}
      <div className="w-full md:w-2/5 bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[60vh] md:min-h-screen">
        <div>
          {/* Logo */}
          <div className="mb-4 sm:mb-6">
            <img 
              src="/images/turf-logo.svg" 
              alt="Turf Logo" 
              className="h-10 w-auto"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
              className="py-6 sm:py-8 md:py-12"
            >
              <motion.h2 
                className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4" 
                style={{ color: slides[currentSlide].color }}
                variants={itemVariants}
              >
                {slides[currentSlide].title}
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8"
                variants={itemVariants}
              >
                {slides[currentSlide].description}
              </motion.p>
              
              <motion.div 
                className="mt-6 sm:mt-8 md:mt-12 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${slides[currentSlide].color}20` }}
                variants={itemVariants}
              >
                <img 
                  src="/api/placeholder/48/48" 
                  alt="Feature icon" 
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-4">
          {/* Progress Indicator */}
          <div className="flex space-x-2 mb-4 sm:mb-6 md:mb-8 justify-center sm:justify-start">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="w-6 sm:w-8 h-1 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ 
                  backgroundColor: index === currentSlide ? slides[currentSlide].color : '#e5e7eb',
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-gray-500 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm sm:text-base"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base font-medium"
              style={{ 
                backgroundColor: slides[currentSlide].color,
                boxShadow: `0 4px 14px 0 ${slides[currentSlide].color}30`
              }}
            >
              {currentSlide < slides.length - 1 ? "Continue" : "Get Started"}
            </button>
          </div>
        </div>
      </div>

      {/* Right Graphic Side - optimized for desktop/mobile */}
      <div 
        className="hidden md:block md:w-3/5 transition-all duration-1000 ease-in-out relative overflow-hidden"
        style={{ 
          background: slides[currentSlide].bgPattern
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Floating elements in background */}
            <motion.div 
              className="absolute w-40 h-40 bg-white bg-opacity-10 rounded-3xl"
              animate={{
                rotate: [12, 24, 12],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                top: "25%",
                left: "25%"
              }}
            />
            <motion.div 
              className="absolute w-60 h-60 bg-white bg-opacity-5 rounded-full"
              animate={{
                rotate: [-6, 6, -6],
                x: [0, 20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                bottom: "25%",
                right: "25%"
              }}
            />
            <motion.div 
              className="absolute w-20 h-20 bg-white bg-opacity-10 rounded-lg"
              animate={{
                rotate: [45, 90, 45],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                top: "33%",
                right: "33%"
              }}
            />
            
            {/* Feature illustration with larger size */}
            <div className="relative z-10 w-72 h-72 md:w-96 md:h-96 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center transform-gpu hover:scale-105 transition-transform duration-500">
              <img 
                src="/api/placeholder/400/400" 
                alt="Feature illustration" 
                className="w-56 h-56 md:w-72 md:h-72 object-contain"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Visual elements that stay in place */}
        <div className="absolute bottom-8 right-8 text-white text-opacity-70 text-sm font-medium tracking-wide">
          <span>Elevate your conversations</span>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenOnboarding; 