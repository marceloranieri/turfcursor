'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { useToast } from '@/components/ui/ToastContext';
import logger from '@/lib/logger';

type GithubRepo = {
  id: number;
  full_name: string;
  name: string;
  private: boolean;
  html_url: string;
  description: string | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [isSaving, setIsSaving] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubSyncEnabled, setGithubSyncEnabled] = useState(false);
  const [githubNotifications, setGithubNotifications] = useState(true);
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);

  const fetchGithubRepos = useCallback(async (accessToken: string) => {
    try {
      setIsLoadingRepos(true);
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setGithubRepos(data);
    } catch (error) {
      showToast({
        message: 'Error fetching GitHub repositories',
        type: 'error',
      });
    } finally {
      setIsLoadingRepos(false);
    }
  }, [showToast]);

  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return;

      try {
        // Load user preferences from metadata
        const preferences = user.user_metadata?.preferences || {};
        setEmailNotifications(preferences.emailNotifications ?? true);
        setPushNotifications(preferences.pushNotifications ?? true);
        setTheme(preferences.theme || 'light');
        setLanguage(preferences.language || 'en');

        // Load GitHub connection state
        const githubData = user.user_metadata?.github || {};
        setGithubConnected(!!githubData.username);
        setGithubUsername(githubData.username || '');
        setGithubSyncEnabled(githubData.sync_enabled || false);
        setGithubNotifications(githubData.notifications ?? true);
        setGithubRepos(githubData.repos || []);
        setSelectedRepos(githubData.selected_repos || []);

        // If we have a GitHub username but no repos, try to fetch them
        if (githubData.username && (!githubData.repos || githubData.repos.length === 0)) {
          // Check if we have a GitHub access token in the session
          const { data: { session } } = await supabase.auth.getSession();
          const githubAccessToken = session?.provider_token;
          
          if (githubAccessToken) {
            await fetchGithubRepos(githubAccessToken);
          }
        }
      } catch (error) {
        logger.error('Error loading user settings:', error);
        showToast({
          message: 'Failed to load settings',
          type: 'error',
        });
      }
    };

    loadUserSettings();
  }, [user, showToast, fetchGithubRepos]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          preferences: {
            emailNotifications,
            pushNotifications,
            theme,
            language,
          },
          github: {
            ...user?.user_metadata?.github,
            sync_enabled: githubSyncEnabled,
            notifications: githubNotifications,
            selected_repos: selectedRepos,
          },
        },
      });

      if (error) throw error;

      showToast({
        message: 'Settings saved successfully',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to save settings',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectGithub = async () => {
    try {
      // Store the current settings in sessionStorage to restore after OAuth redirect
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('settingsState', JSON.stringify({
          emailNotifications,
          pushNotifications,
          theme,
          language,
          githubSyncEnabled,
          githubNotifications,
          selectedRepos
        }));
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/settings`,
          scopes: 'read:user user:email repo',
        },
      });

      if (error) throw error;
      
      showToast({
        message: 'Redirecting to GitHub...',
        type: 'info',
      });
    } catch (error) {
      showToast({
        message: 'Failed to connect to GitHub',
        type: 'error',
      });
    }
  };

  const handleDisconnectGithub = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          github: null,
        },
      });

      if (error) throw error;

      setGithubConnected(false);
      setGithubUsername('');
      setGithubSyncEnabled(false);
      setGithubRepos([]);
      setSelectedRepos([]);
      
      showToast({
        message: 'GitHub account disconnected successfully',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to disconnect GitHub account',
        type: 'error',
      });
    }
  };

  const handleRepoSelection = (repo: string) => {
    setSelectedRepos(prev => {
      if (prev.includes(repo)) {
        return prev.filter(r => r !== repo);
      } else {
        return [...prev, repo];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary p-4">
      <div className="max-w-4xl mx-auto bg-background-secondary rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Settings</h1>

        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Notifications Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-text-primary">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="emailNotifications" className="text-text-primary">
                    Email Notifications
                  </label>
                  <p className="text-sm text-text-secondary">
                    Receive email notifications for important updates
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={emailNotifications}
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`${
                    emailNotifications ? 'bg-accent-primary' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="pushNotifications" className="text-text-primary">
                    Push Notifications
                  </label>
                  <p className="text-sm text-text-secondary">
                    Receive push notifications in your browser
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={pushNotifications}
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`${
                    pushNotifications ? 'bg-accent-primary' : 'bg-gray-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span
                    className={`${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* GitHub Integration Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-text-primary">GitHub Integration</h2>
            <div className="space-y-4">
              {githubConnected ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={`https://github.com/${githubUsername}.png`}
                        alt="GitHub Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-text-primary">Connected as {githubUsername}</p>
                        <button
                          type="button"
                          onClick={handleDisconnectGithub}
                          className="text-sm text-red-500 hover:text-red-600"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="githubSync" className="text-text-primary">
                        Sync Activity
                      </label>
                      <p className="text-sm text-text-secondary">
                        Sync your GitHub activity with Turf
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={githubSyncEnabled}
                      onClick={() => setGithubSyncEnabled(!githubSyncEnabled)}
                      className={`${
                        githubSyncEnabled ? 'bg-accent-primary' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          githubSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="githubNotifications" className="text-text-primary">
                        GitHub Notifications
                      </label>
                      <p className="text-sm text-text-secondary">
                        Receive notifications for GitHub activity
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={githubNotifications}
                      onClick={() => setGithubNotifications(!githubNotifications)}
                      className={`${
                        githubNotifications ? 'bg-accent-primary' : 'bg-gray-300'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${
                          githubNotifications ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </button>
                  </div>

                  {githubSyncEnabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-text-primary mb-2">
                          Select Repositories to Sync
                        </label>
                        <p className="text-sm text-text-secondary mb-4">
                          Choose which repositories to sync with Turf
                        </p>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {githubRepos.map((repo) => (
                            <div
                              key={repo.full_name}
                              className="flex items-center space-x-3 p-2 rounded-md hover:bg-background-tertiary"
                            >
                              <input
                                type="checkbox"
                                id={repo.full_name}
                                checked={selectedRepos.includes(repo.full_name)}
                                onChange={() => handleRepoSelection(repo.full_name)}
                                className="h-4 w-4 text-accent-primary focus:ring-accent-primary border-gray-300 rounded"
                              />
                              <label htmlFor={repo.full_name} className="text-text-primary">
                                {repo.full_name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-primary">Connect your GitHub account</p>
                    <p className="text-sm text-text-secondary">
                      Link your GitHub account to sync activity and receive notifications
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConnectGithub}
                    className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-primary-dark transition-colors"
                  >
                    Connect GitHub
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Appearance Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-text-primary">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="theme" className="block text-text-primary mb-2">
                  Theme
                </label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3 py-2 bg-background-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-text-primary mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-background-primary border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-accent-primary text-white px-6 py-2 rounded-md hover:bg-accent-primary-dark transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 