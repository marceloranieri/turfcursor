'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

// Feature slide type definition
interface FeatureSlide {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

// Define the slides for the carousel
const featureSlides: FeatureSlide[] = [
  {
    title: "Effortlessly manage your team and operations.",
    description: "Log in to access your CRM dashboard and manage your team.",
    imageSrc: "/images/features/dashboard.png",
    imageAlt: "Dashboard preview"
  },
  {
    title: "Daily topics that spark meaningful debates.",
    description: "Engage with quality content selected to inspire thoughtful discussions.",
    imageSrc: "/images/features/discussions.png",
    imageAlt: "Discussions preview"
  },
  {
    title: "Connect with like-minded thinkers.",
    description: "Build a network of connections that share your intellectual curiosity.",
    imageSrc: "/images/features/network.png",
    imageAlt: "Network preview"
  },
  {
    title: "All your conversations in one place.",
    description: "Easily find and continue discussions that matter to you.",
    imageSrc: "/images/features/conversations.png",
    imageAlt: "Conversations preview"
  }
];

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Auto-rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Function to navigate to a specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featureSlides.length) % featureSlides.length);
  };
  
  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featureSlides.length);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left panel - Form side */}
          <div className="flex w-full flex-col justify-between p-6 md:w-1/2 md:p-10 lg:p-16">
            <div className="mb-8">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-4-4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xl font-semibold">TURF</span>
                </div>
              </Link>
            </div>
            
            <div className="flex-1">
              {children}
            </div>
            
            <div className="mt-8 flex justify-between text-sm text-gray-400">
              <div>© {new Date().getFullYear()} Turf</div>
              <div className="flex space-x-4">
                <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
              </div>
            </div>
          </div>
          
          {/* Right panel - Feature carousel */}
          <div className="relative hidden w-1/2 bg-blue-600 md:block">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-12"
              >
                <div className="max-w-md">
                  {/* Navigation arrow */}
                  <button 
                    onClick={prevSlide}
                    className="mb-4 flex items-center text-white/80 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  
                  {/* Content */}
                  <motion.h2 
                    className="mb-4 text-3xl font-bold text-white"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    {featureSlides[currentSlide].title}
                  </motion.h2>
                  
                  <motion.p 
                    className="mb-8 text-white/90"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {featureSlides[currentSlide].description}
                  </motion.p>
                  
                  {/* Feature illustration */}
                  <motion.div 
                    className="relative mx-auto rounded-lg bg-white/20 p-4 backdrop-blur-sm"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="overflow-hidden rounded-md">
                      {currentSlide === 0 && (
                        <div className="bg-white p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-md bg-blue-50 p-3">
                              <p className="text-xs font-medium text-blue-900">Total Sales</p>
                              <p className="text-xl font-bold text-blue-900">$189,374</p>
                              <div className="mt-4 h-2 w-16 rounded bg-blue-500"></div>
                            </div>
                            <div className="rounded-md bg-blue-50 p-3">
                              <p className="text-xs font-medium text-blue-900">Chat Performance</p>
                              <p className="text-xl font-bold text-blue-900">00:01:30</p>
                              <div className="mt-2 flex items-center">
                                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                <span className="ml-1 text-xs text-blue-600">5.2%</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 rounded-md bg-blue-50 p-3">
                            <p className="text-xs font-medium text-blue-900">Total Profit</p>
                            <p className="text-xl font-bold text-blue-900">$25,684</p>
                            <div className="mt-2 flex items-center">
                              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                              <span className="ml-1 text-xs text-green-600">8.1%</span>
                            </div>
                          </div>

                          <div className="mt-4 rounded-md bg-white">
                            <table className="w-full table-auto text-xs">
                              <thead>
                                <tr className="border-b text-left">
                                  <th className="py-2">Product</th>
                                  <th className="py-2">Date</th>
                                  <th className="py-2">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b">
                                  <td className="py-2">Apple MacBook</td>
                                  <td className="py-2">15 Feb 2025</td>
                                  <td className="py-2">$1,199</td>
                                </tr>
                                <tr className="border-b">
                                  <td className="py-2">iPad Pro</td>
                                  <td className="py-2">14 Feb 2025</td>
                                  <td className="py-2">$899</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {currentSlide !== 0 && (
                        <Image 
                          src={featureSlides[currentSlide].imageSrc} 
                          alt={featureSlides[currentSlide].imageAlt} 
                          width={400} 
                          height={280} 
                          className="rounded-md" 
                        />
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Slide indicators */}
                <div className="absolute bottom-8 left-0 flex w-full justify-center space-x-2">
                  {featureSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index === currentSlide ? "bg-white" : "bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 