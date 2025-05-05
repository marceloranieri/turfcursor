"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthLayout from "@/components/auth/AuthLayout";
import ErrorMessage from "@/components/auth/ErrorMessage";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Authentication logic here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md"
      >
        <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>
        <p className="mb-8 text-gray-500">Enter your email and password to access your account.</p>
        
        {error && <ErrorMessage message={error} />}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="yourname@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Remember Me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot Your Password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 py-3 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Or Login With
            </p>
            <div className="mt-3 flex justify-center space-x-4">
              <button 
                type="button" 
                className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button 
                type="button" 
                className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.04,10.25c-0.04-3.35,2.74-4.98,2.87-5.06c-1.56-2.29-4-2.61-4.87-2.64c-2.07-0.21-4.04,1.21-5.09,1.21 c-1.05,0-2.68-1.19-4.41-1.16c-2.27,0.04-4.35,1.32-5.53,3.34c-2.36,4.1-0.6,10.17,1.69,13.49c1.12,1.63,2.46,3.46,4.21,3.39 c1.7-0.07,2.33-1.1,4.38-1.1c2.04,0,2.63,1.1,4.42,1.06c1.82-0.03,2.98-1.66,4.1-3.29c1.29-1.89,1.82-3.72,1.86-3.82 C16.54,12.34,13.08,10.4,13.04,10.25z M10.85,3.17c0.94-1.14,1.57-2.72,1.4-4.3c-1.35,0.05-2.99,0.9-3.96,2.04 C7.42,1.96,6.67,3.5,6.85,5.03C8.32,5.11,9.91,4.31,10.85,3.17z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't Have An Account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800">
              Register Now
            </Link>
          </p>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
