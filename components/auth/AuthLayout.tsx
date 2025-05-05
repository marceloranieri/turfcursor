'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  rightSideContent?: {
    title: string;
    description: string;
  };
}

export default function AuthLayout({ 
  children, 
  title, 
  description, 
  rightSideContent 
}: AuthLayoutProps) {
  // Turf brand color
  const brandColor = "#4f46e5"; // Indigo
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Auth Form */}
      <div className="w-full md:w-2/5 bg-white p-4 sm:p-6 md:p-8 flex flex-col justify-between min-h-[60vh] md:min-h-screen">
        <div>
          {/* Logo */}
          <div className="mb-4 sm:mb-6">
            <img 
              src="/images/turf-logo.svg" 
              alt="Turf Logo" 
              className="h-6 sm:h-8 md:h-10 w-auto transform-gpu hover:scale-105 transition-transform duration-300"
              width="102"
              height="26"
              priority="true"
            />
          </div>
          
          <div className="py-6 sm:py-8 md:py-12">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-gray-900">
              {title}
            </h1>
            
            {description && (
              <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8">
                {description}
              </p>
            )}
            
            {/* Auth form content */}
            {children}
          </div>
        </div>
        
        <div className="mt-auto pt-4 text-center text-sm text-text-muted">
          &copy; 2025 Turf. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Feature Showcase */}
      <div 
        className="hidden md:block md:w-3/5 transition-all duration-1000 ease-in-out relative overflow-hidden"
        style={{ 
          background: "radial-gradient(circle at 40% 60%, rgba(79, 70, 229, 0.7) 0%, rgba(67, 56, 202, 0.7) 50%, rgba(55, 48, 163, 0.8) 100%)"
        }}
      >
        {rightSideContent && (
          <>
            {/* Text content */}
            <div className="absolute top-1/4 left-8 right-8 text-white z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-4"
              >
                {rightSideContent.title}
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                className="text-lg text-white text-opacity-90"
              >
                {rightSideContent.description}
              </motion.p>
            </div>
          </>
        )}
        
        {/* Animated background elements */}
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
        
        {/* Feature illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative z-10 w-72 h-72 md:w-96 md:h-96 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center transform-gpu hover:scale-105 transition-transform duration-500">
            <img 
              src="/api/placeholder/400/400" 
              alt="Feature illustration" 
              className="w-56 h-56 md:w-72 md:h-72 object-contain"
            />
          </div>
        </div>
        
        {/* Bottom navigation dots (purely decorative) */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-white"></span>
          <span className="h-2 w-2 rounded-full bg-white bg-opacity-40"></span>
          <span className="h-2 w-2 rounded-full bg-white bg-opacity-40"></span>
          <span className="h-2 w-2 rounded-full bg-white bg-opacity-40"></span>
        </div>
        
        {/* Footer text */}
        <div className="absolute bottom-8 right-8 text-white text-opacity-70 text-sm font-medium tracking-wide">
          <span>Elevate your conversations</span>
        </div>
      </div>
    </div>
  );
} 