import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import styles from './MobileAuthPage.module.css';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { RiArrowDownSLine, RiArrowUpSLine } from 'react-icons/ri';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { SupabaseClient } from '@supabase/auth-helpers-nextjs';

interface FormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function MobileAuthPage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  
  // Initialize Supabase client on the client side only
  useEffect(() => {
    setSupabase(createClientComponentClient());
  }, []);
  
  // State for form values and validation
  const [formValues, setFormValues] = useState<FormValues>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State for preview section toggle
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  
  // Sample preview messages - replace with your actual data
  const previewMessages = [
    {
      username: 'Tolkien_Lore',
      avatar: '/avatars/tolkien-lore.png',
      message: 'The Ring corrupts power. Luke\'s stronger = faster fall',
    },
    {
      username: 'ForceIsWithMe',
      avatar: '/avatars/force-user.png',
      message: 'Y\'all forgetting Luke resisted Emperor\'s temptation...',
    },
    {
      username: 'HobbitFeet99',
      avatar: '/avatars/hobbit.png',
      message: 'Luke? No way. Read the book: The Ring isn\'t about willpower, it\'s about humility!',
    }
  ];

  // Form change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };
  
  // Form validation function
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Email validation
    if (!formValues.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formValues.password) {
      errors.password = 'Password is required';
    } else if (formValues.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Form submit handler with Supabase authentication
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!supabase) {
      setFormErrors({ general: 'Authentication service not available' });
      return;
    }
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formValues.email,
          password: formValues.password,
          options: {
            // Set session persistence based on "Remember Me" checkbox
            persistSession: formValues.rememberMe
          }
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setFormErrors({
              email: 'Invalid email or password. Please check your credentials.'
            });
          } else {
            setFormErrors({
              general: error.message || 'Authentication failed. Please try again.'
            });
          }
        } else {
          console.log('Authentication successful', data);
          // Redirect to dashboard or home page
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setFormErrors({
          general: 'An unexpected error occurred. Please try again later.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Google OAuth sign in with Supabase
  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setFormErrors({ general: 'Authentication service not available' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Google sign-in error:', error);
        setFormErrors({ 
          general: 'Google sign-in failed. Please try again.' 
        });
        setIsSubmitting(false);
      }
      // On success, Supabase will redirect automatically
    } catch (error) {
      console.error('Google sign-in error:', error);
      setFormErrors({ 
        general: 'An unexpected error occurred. Please try again later.' 
      });
      setIsSubmitting(false);
    }
  };
  
  // Facebook OAuth sign in with Supabase
  const handleFacebookSignIn = async () => {
    if (!supabase) {
      setFormErrors({ general: 'Authentication service not available' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      
      if (error) {
        console.error('Facebook sign-in error:', error);
        setFormErrors({ 
          general: 'Facebook sign-in failed. Please try again.' 
        });
        setIsSubmitting(false);
      }
      // On success, Supabase will redirect automatically
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      setFormErrors({ 
        general: 'An unexpected error occurred. Please try again later.' 
      });
      setIsSubmitting(false);
    }
  };
  
  // Toggle preview section
  const togglePreview = () => {
    setIsPreviewOpen(prev => !prev);
  };

  return (
    <div className={styles.turfContainer}>
      {/* Header section */}
      <header className={styles.turfHeader}>
        <div className={styles.turfLogo}>TURF</div>
        <h1 className={styles.turfWelcome}>Welcome to Turf <span role="img" aria-label="wave">👋</span></h1>
        <p className={styles.turfDescription}>
          Chatrooms with daily-curated debates on your favorite topics.
        </p>
      </header>

      {/* Authentication card */}
      <div className={styles.authCard}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          {/* General error message */}
          {formErrors.general && (
            <div className={styles.generalError} role="alert">
              {formErrors.general}
            </div>
          )}
          
          {/* Email field */}
          <div className={`${styles.formGroup} ${formErrors.email ? styles.hasError : ''}`}>
            <label htmlFor="email" className={styles.formLabel}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Example@email.com"
              className={styles.formControl}
              aria-invalid={!!formErrors.email}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              disabled={isSubmitting}
            />
            {formErrors.email && (
              <div className={styles.errorMessage} id="email-error" role="alert">
                {formErrors.email}
              </div>
            )}
          </div>
          
          {/* Password field */}
          <div className={`${styles.formGroup} ${formErrors.password ? styles.hasError : ''}`}>
            <label htmlFor="password" className={styles.formLabel}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              className={styles.formControl}
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? "password-error" : undefined}
              disabled={isSubmitting}
            />
            {formErrors.password && (
              <div className={styles.errorMessage} id="password-error" role="alert">
                {formErrors.password}
              </div>
            )}
            <div className={styles.formOptions}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formValues.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <a href="/forgot-password" className={styles.forgotPassword}>Forgot Password?</a>
            </div>
          </div>
          
          {/* Sign in button */}
          <button 
            type="submit" 
            className={styles.signInBtn}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
          
          {/* Alternative login options */}
          <div className={styles.altLogin}>
            <div className={styles.divider}>
              <span>Or sign in with</span>
            </div>
            <div className={styles.socialButtons}>
              <button
                type="button"
                className={styles.googleBtn}
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                aria-label="Sign in with Google"
              >
                <FaGoogle /> Google
              </button>
              <button
                type="button"
                className={styles.facebookBtn}
                onClick={handleFacebookSignIn}
                disabled={isSubmitting}
                aria-label="Sign in with Facebook"
              >
                <FaFacebook /> Facebook
              </button>
            </div>
          </div>
          
          {/* Sign up prompt */}
          <div className={styles.signupPrompt}>
            Don't you have an account? <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
      
      {/* Preview section */}
      <div className={styles.previewSection}>
        <button
          type="button"
          className={`${styles.previewToggle} ${isPreviewOpen ? styles.expanded : ''}`}
          onClick={togglePreview}
          aria-expanded={isPreviewOpen}
          aria-controls="previewContent"
          disabled={isSubmitting}
        >
          {isPreviewOpen ? 'Hide discussions' : 'Preview discussions'}
          {isPreviewOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
        </button>
        
        <div
          id="previewContent"
          className={`${styles.previewContent} ${isPreviewOpen ? styles.open : ''}`}
          aria-hidden={!isPreviewOpen}
        >
          <div className={styles.debateQuestion}>
            <h3>Could Luke have resisted the One Ring better than Frodo?</h3>
          </div>
          
          <div className={styles.messagesPreview}>
            {previewMessages.map((message, index) => (
              <div key={index} className={styles.messageCard}>
                <div className={styles.userAvatar}>
                  <div className={styles.avatarPlaceholder}>
                    {message.username.charAt(0)}
                  </div>
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.username}>{message.username}</div>
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.joinDebate}>
            <a href="/signup" className={styles.joinBtn}>
              Join the debate
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 