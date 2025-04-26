'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import DiscordInput from '@/components/ui/DiscordInput';
import DiscordButton from '@/components/ui/DiscordButton';
import { Profile } from '@/lib/types';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setUsername(data.username);
      setAvatarUrl(data.avatar_url || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    }
  };

  if (!profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-blue)]"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[var(--channel-bg)] rounded-lg shadow-xl p-8">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Image
                  src={profile.avatar_url || '/default-avatar.png'}
                  alt={profile.username}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[var(--primary-blue)] rounded-full p-2 cursor-pointer">
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                )}
              </div>
              <div>
                {isEditing ? (
                  <DiscordInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-[var(--header-primary)]">
                    {profile.username}
                  </h1>
                )}
              </div>
            </div>
            <DiscordButton
              variant="secondary"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              isLoading={isLoading}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </DiscordButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Stats */}
            <div className="bg-[var(--input-bg)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--header-primary)] mb-4">
                Stats
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[var(--text-muted)]">Harmony Points</p>
                  <p className="text-2xl font-bold text-[var(--header-primary)]">
                    {profile.harmony_points}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)]">Genius Awards Received</p>
                  <p className="text-2xl font-bold text-[var(--header-primary)]">
                    {profile.genius_awards_received}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--text-muted)]">Genius Awards Remaining Today</p>
                  <p className="text-2xl font-bold text-[var(--header-primary)]">
                    {profile.genius_awards_remaining}
                  </p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-[var(--input-bg)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--header-primary)] mb-4">
                Achievements
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {profile.harmony_points >= 100 && (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🎵</div>
                    <p className="text-sm text-[var(--text-normal)]">Harmony Master</p>
                  </div>
                )}
                {profile.genius_awards_received >= 10 && (
                  <div className="text-center">
                    <div className="text-4xl mb-2">🌟</div>
                    <p className="text-sm text-[var(--text-normal)]">Debate Maestro</p>
                  </div>
                )}
                {/* Add more achievements based on user stats */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 