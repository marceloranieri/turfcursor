'use client';

import { useAuth } from "@/lib/auth/useAuth.tsx";
import { useRouter } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  redirectTo = "/login" 
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to finish loading
    if (!isLoading) {
      if (!user) {
        // Redirect if no user is found
        router.push(redirectTo);
      } else {
        // Auth check complete, render children
        setIsChecking(false);
      }
    }
  }, [user, isLoading, router, redirectTo]);

  // Show loading state while checking auth
  if (isLoading || isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children if authenticated
  return user ? <>{children}</> : null;
} 