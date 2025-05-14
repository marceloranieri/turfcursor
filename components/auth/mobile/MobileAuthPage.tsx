"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MobileAuthPage.module.css';
import { supabase } from '@/lib/supabase';

export default function MobileAuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleTabChange = (tab: string) => setActiveTab(tab);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', { email, password, rememberMe });
    // Add your authentication logic here
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting Google sign-in...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Supabase OAuth error:', error);
        throw error;
      }
      
      console.log('Sign-in successful, redirecting...');
      // The redirect will happen automatically
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background with stars */}
      <div className={styles.backgroundContainer}>
        <div className={styles.starsBackground}></div>
      </div>
      
      {/* Status bar */}
      <div className={styles.statusBar}>
        <div className={styles.time}>9:41</div>
        <div className={styles.statusIcons}>
          <div className={styles.signal}></div>
          <div className={styles.wifi}></div>
          <div className={styles.battery}></div>
        </div>
      </div>
      
      {/* Top content area */}
      <div className={styles.contentTop}>
        <div className={styles.logoContainer}>
          <Image
            src="/turf-logo.svg"
            alt="Turf Logo"
            width={99}
            height={18}
            className={styles.logo}
          />
        </div>
        
        <div className={styles.headerText}>
          <h1 className={styles.title}>Welcome to Turf <span role="img" aria-label="wave">👋</span></h1>
          <p className={styles.subtitle}>Daily chat debates on your favorite topics.</p>
        </div>
      </div>
      
      {/* Authentication card */}
      <div className={styles.authCard}>
        {/* Tab navigation */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'login' ? '' : styles.tabInactive}`} 
            onClick={() => handleTabChange('login')}
          >
            Log In
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'signup' ? '' : styles.tabInactive}`} 
            onClick={() => handleTabChange('signup')}
          >
            Sign up
          </button>
        </div>
        
        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputContainer}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="email@example.com"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputContainer}>
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
              />
              <button 
                type="button" 
                className={styles.eyeIcon}
                onClick={() => setPasswordVisible(!passwordVisible)}
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>
          
          <div className={styles.formOptions}>
            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className={styles.checkbox}
              />
              <label htmlFor="rememberMe" className={styles.checkboxLabel}>Remember me</label>
            </div>
            <Link href="/forgot-password" className={styles.forgotPassword}>
              Forgot Password?
            </Link>
          </div>
          
          <button type="submit" className={styles.loginButton}>
            {activeTab === 'login' ? 'Log In' : 'Sign Up'}
          </button>
          
          <div className={styles.divider}>
            <div className={styles.dividerLine}></div>
            <span className={styles.dividerText}>Or</span>
            <div className={styles.dividerLine}></div>
          </div>
          
          <div className={styles.socialButtons}>
            <button type="button" className={styles.googleButton} onClick={handleGoogleSignIn}>
              <span className={styles.googleIcon}>G</span>
              Continue with Google
            </button>
            
            <button type="button" className={styles.facebookButton}>
              <span className={styles.facebookIcon}>f</span>
              Continue with Facebook
            </button>
          </div>
        </form>
      </div>
      
      {/* Home indicator */}
      <div className={styles.homeIndicator}>
        <div className={styles.homeIndicatorBar}></div>
      </div>
    </div>
  );
} 