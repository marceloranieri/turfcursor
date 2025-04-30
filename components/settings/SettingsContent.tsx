'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';
import { useToast } from '@/components/ui/ToastContext';
import { ActivityFeed } from '@/components/github/ActivityFeed';
import { RepositoryCard } from '@/components/github/RepositoryCard';
import { NotificationsList } from '@/components/github/NotificationsList';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

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

export default function SettingsContent() {
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
        showToast('API rate limit exceeded. Resets at ' + new Date(rateData.rate.reset * 1000).toLocaleTimeString(), 'error');
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
      showToast(error instanceof Error ? error.message : 'Error fetching GitHub repositories', 'error');
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
      showToast(error instanceof Error ? error.message : 'Error fetching GitHub profile', 'error');
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
        showToast('Failed to load settings', 'error');
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

      showToast('Settings saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
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
      
      showToast('Redirecting to GitHub...', 'info');
    } catch (error) {
      showToast('Failed to connect to GitHub', 'error');
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
      
      showToast('GitHub account disconnected successfully', 'success');
    } catch (error) {
      showToast('Failed to disconnect GitHub account', 'error');
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
        showToast('GitHub data refreshed successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to refresh GitHub data', 'error');
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <NotificationCenter />
    </div>
  );
} 