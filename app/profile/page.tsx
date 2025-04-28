'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/ToastContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userProfile: User = {
        id: user.id,
        username: user.user_metadata?.username || '',
        email: user.email || '',
        avatar_url: user.user_metadata?.avatar_url,
        created_at: user.created_at || new Date().toISOString(),
        harmony_points: user.user_metadata?.harmony_points || 0,
        genius_awards_received: 0,
        genius_awards_remaining: user.user_metadata?.genius_awards_remaining || 0,
        is_debate_maestro: user.user_metadata?.is_debate_maestro || false,
        user_metadata: user.user_metadata
      };
      setProfile(userProfile);
      setUsername(user.user_metadata?.username || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          username,
          avatar_url: avatarUrl,
        },
      });

      if (error) throw error;

      showToast({
        message: 'Profile updated successfully!',
        type: 'success',
      });
      setIsEditing(false);
    } catch (error) {
      showToast({
        message: 'Error updating profile. Please try again.',
        type: 'error',
      });
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (error) {
      showToast({
        message: 'Error signing out. Please try again.',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-2xl mx-auto bg-background-secondary rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Your Profile</h1>
          <p className="text-text-secondary mt-2">Manage your account settings</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent-primary text-white text-4xl">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold text-text-primary">{username || 'User'}</h2>
            <p className="text-text-secondary text-sm">{user.email}</p>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-primary-dark transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="md:w-2/3">
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-text-secondary mb-1">
                    Avatar URL
                  </label>
                  <input
                    id="avatarUrl"
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-accent-primary text-white py-2 px-4 rounded-md hover:bg-accent-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">Account Information</h3>
                  <div className="bg-background-primary rounded-md p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-text-secondary">Email</div>
                      <div className="text-text-primary">{user.email}</div>
                      <div className="text-text-secondary">Member Since</div>
                      <div className="text-text-primary">
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">Account Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 