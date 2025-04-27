import logger from '@/lib/logger';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { AppLayout } from '@/components/layout/AppLayout';
import DiscordButton from '@/components/ui/DiscordButton';

interface Settings {
  notifications_enabled: boolean;
  email_notifications: boolean;
  dark_mode: boolean;
  sound_enabled: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    notifications_enabled: true,
    email_notifications: true,
    dark_mode: true,
    sound_enabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const saveSettings = useCallback(async (newSettings: Settings) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...newSettings,
        });

      if (error) throw error;
      setSettings(newSettings);
    } catch (error) {
      logger.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchSettings = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          await saveSettings(settings);
        } else {
          throw error;
        }
      } else if (data) {
        setSettings(data);
      }
    } catch (error) {
      logger.error('Error fetching settings:', error);
    }
  }, [user, settings, saveSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggle = (key: keyof Settings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(newSettings);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-[var(--channel-bg)] rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[var(--header-primary)] mb-8">
            Settings
          </h1>

          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-[var(--input-bg)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--header-primary)] mb-4">
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--text-normal)]">Push Notifications</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Receive notifications for mentions and reactions
                    </p>
                  </div>
                  <DiscordButton
                    variant={settings.notifications_enabled ? 'primary' : 'secondary'}
                    onClick={() => handleToggle('notifications_enabled')}
                  >
                    {settings.notifications_enabled ? 'Enabled' : 'Disabled'}
                  </DiscordButton>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--text-normal)]">Email Notifications</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Receive email updates for important activity
                    </p>
                  </div>
                  <DiscordButton
                    variant={settings.email_notifications ? 'primary' : 'secondary'}
                    onClick={() => handleToggle('email_notifications')}
                  >
                    {settings.email_notifications ? 'Enabled' : 'Disabled'}
                  </DiscordButton>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-[var(--input-bg)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--header-primary)] mb-4">
                Appearance
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--text-normal)]">Dark Mode</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Toggle between light and dark theme
                    </p>
                  </div>
                  <DiscordButton
                    variant={settings.dark_mode ? 'primary' : 'secondary'}
                    onClick={() => handleToggle('dark_mode')}
                  >
                    {settings.dark_mode ? 'Dark' : 'Light'}
                  </DiscordButton>
                </div>
              </div>
            </div>

            {/* Sound */}
            <div className="bg-[var(--input-bg)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--header-primary)] mb-4">
                Sound
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--text-normal)]">Notification Sounds</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      Play sounds for new messages and notifications
                    </p>
                  </div>
                  <DiscordButton
                    variant={settings.sound_enabled ? 'primary' : 'secondary'}
                    onClick={() => handleToggle('sound_enabled')}
                  >
                    {settings.sound_enabled ? 'Enabled' : 'Disabled'}
                  </DiscordButton>
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="mt-4 text-center text-[var(--text-muted)]">
              Saving changes...
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
} 