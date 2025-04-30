'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { useToast } from '@/components/ui/ToastContext';
import ActivityFeed from '@/components/github/ActivityFeed';
import RepositoryCard from '@/components/github/RepositoryCard';
import NotificationsList from '@/components/github/NotificationsList';
// import logger from '@/lib/logger';

type GithubRepo = {
  id: number;
  full_name: string;
  name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  updated_at?: string;
  language?: string;
  stargazers_count?: number;
  forks_count?: number;
  watchers_count?: number;
  topics?: string[];
  default_branch?: string;
};

export default function SettingsPage(): JSX.Element {
  const router = useRouter();
  const { user, isLoading, session } = useAuth();
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rateLimit, setRateLimit] = useState<{ remaining: number; reset: Date } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'stars'>('updated');
  const [githubProfile, setGithubProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchGithubRepos = useCallback(async (accessToken: string) => {
    try {
      setIsLoadingRepos(true);
      
      // First check rate limit
      const rateResponse = await fetch('https://api.github.com/rate_limit', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const rateData = await rateResponse.json();
      setRateLimit({
        remaining: rateData.rate.remaining,
        reset: new Date(rateData.rate.reset * 1000),
      });
      
      if (rateData.rate.remaining === 0) {
        showToast({
          message: `API rate limit exceeded. Resets at ${new Date(rateData.rate.reset * 1000).toLocaleTimeString()}`,
          type: 'error',
        });
        return;
      }

      const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      setGithubRepos(data);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Error fetching GitHub repositories',
        type: 'error',
      });
    } finally {
      setIsLoadingRepos(false);
    }
  }, [showToast]);

  const fetchGithubProfile = useCallback(async (accessToken: string) => {
    try {
      setIsLoadingProfile(true);
      
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const data = await response.json();
      setGithubProfile(data);
    } catch (error) {
      showToast({
        message: error instanceof Error ? error.message : 'Error fetching GitHub profile',
        type: 'error',
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [showToast]);

  // Filter and sort repositories
  const filteredRepos = useMemo(() => {
    return githubRepos
      .filter(repo => 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'stars':
            return (b.stargazers_count || 0) - (a.stargazers_count || 0);
          case 'updated':
          default:
            return new Date(b.updated_at || '').getTime() - new Date(a.updated_at || '').getTime();
        }
      });
  }, [githubRepos, searchQuery, sortBy]);

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
            await fetchGithubProfile(githubAccessToken);
          }
        }
      } catch (error) {
        // logger.error('Error loading user settings:', error);
        showToast({
          message: 'Failed to load settings',
          type: 'error',
        });
      }
    };

    loadUserSettings();
  }, [user, showToast, fetchGithubRepos, fetchGithubProfile]);

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
          scopes: 'read:user user:email repo notifications gist',
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

  const handleRefreshRepos = async () => {
    if (!user) return;
    
    setIsRefreshing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const githubAccessToken = session?.provider_token;
      
      if (githubAccessToken) {
        await fetchGithubRepos(githubAccessToken);
        await fetchGithubProfile(githubAccessToken);
        showToast({
          message: 'GitHub data refreshed successfully',
          type: 'success',
        });
      }
    } catch (error) {
      showToast({
        message: 'Failed to refresh GitHub data',
        type: 'error',
      });
    } finally {
      setIsRefreshing(false);
    }
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-text-primary">GitHub Integration</h2>
              {githubConnected && (
                <button
                  type="button"
                  onClick={handleRefreshRepos}
                  disabled={isRefreshing || (rateLimit?.remaining === 0)}
                  className="text-sm text-accent-primary hover:text-accent-primary-dark disabled:opacity-50"
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                </button>
              )}
            </div>
            
            {rateLimit && rateLimit.remaining < 20 && (
              <div className="text-sm text-yellow-500">
                API rate limit: {rateLimit.remaining} requests remaining. Resets at {rateLimit.reset.toLocaleTimeString()}
              </div>
            )}

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

                  {/* GitHub Profile Section */}
                  {githubProfile && (
                    <div className="p-4 bg-background-tertiary rounded-lg border border-background-secondary">
                      <div className="flex items-start space-x-4">
                        <Image
                          src={githubProfile.avatar_url}
                          alt="GitHub Profile"
                          width={80}
                          height={80}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-text-primary">
                              {githubProfile.name || githubProfile.login}
                            </h3>
                            <a
                              href={`https://github.com/${githubProfile.login}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-primary hover:text-accent-primary-dark"
                            >
                              @{githubProfile.login}
                            </a>
                            {githubProfile.hireable && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                Open to Work
                              </span>
                            )}
                          </div>
                          {githubProfile.bio && (
                            <p className="text-sm text-text-secondary mt-1">{githubProfile.bio}</p>
                          )}
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-text-secondary">
                            {githubProfile.company && (
                              <a
                                href={`https://github.com/${githubProfile.company.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center hover:text-accent-primary"
                              >
                                <span className="mr-1">🏢</span> {githubProfile.company}
                              </a>
                            )}
                            {githubProfile.location && (
                              <div className="flex items-center">
                                <span className="mr-1">📍</span> {githubProfile.location}
                              </div>
                            )}
                            {githubProfile.blog && (
                              <a 
                                href={githubProfile.blog.startsWith('http') ? githubProfile.blog : `https://${githubProfile.blog}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center text-accent-primary hover:underline"
                              >
                                <span className="mr-1">🌐</span> Website
                              </a>
                            )}
                            {githubProfile.twitter_username && (
                              <a
                                href={`https://twitter.com/${githubProfile.twitter_username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-accent-primary hover:underline"
                              >
                                <span className="mr-1">🐦</span> @{githubProfile.twitter_username}
                              </a>
                            )}
                          </div>
                          <div className="grid grid-cols-4 gap-4 mt-4 p-3 bg-background-secondary rounded-lg">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-text-primary">
                                {githubProfile.followers.toLocaleString()}
                              </div>
                              <div className="text-xs text-text-secondary">Followers</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-text-primary">
                                {githubProfile.following.toLocaleString()}
                              </div>
                              <div className="text-xs text-text-secondary">Following</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-text-primary">
                                {githubProfile.public_repos.toLocaleString()}
                              </div>
                              <div className="text-xs text-text-secondary">Repositories</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-text-primary">
                                {githubProfile.public_gists.toLocaleString()}
                              </div>
                              <div className="text-xs text-text-secondary">Gists</div>
                            </div>
                          </div>
                          {githubProfile.created_at && (
                            <div className="mt-3 text-sm text-text-secondary">
                              Member since {new Date(githubProfile.created_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

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

                  {/* GitHub Notifications Section */}
                  {githubNotifications && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium text-text-primary">GitHub Notifications</h3>
                      <NotificationsList
                        accessToken={session?.provider_token || ''}
                        onError={(message) => showToast({ message, type: 'error' })}
                      />
                    </div>
                  )}

                  {/* GitHub Activity Feed Section */}
                  {githubSyncEnabled && selectedRepos.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <h3 className="text-lg font-medium text-text-primary">Recent Activity</h3>
                      <ActivityFeed selectedRepos={selectedRepos} limit={5} />
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