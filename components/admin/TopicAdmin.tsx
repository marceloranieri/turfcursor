'use client';

import logger from '@/lib/logger';
import React, { useState, useEffect } from 'react';
import { getActiveTopics, getTopicHistory, manuallyRefreshTopics, addTopic } from '../../lib/topics/topicHelpers';
import { Topic, TopicHistory } from '../../lib/topics/types';
import { useAuth } from '../../lib/auth/AuthContext';
import { supabase } from '../../lib/supabase/client';
import toast from 'react-hot-toast';

export default function TopicAdmin() {
  const [activeTopics, setActiveTopics] = useState<Topic[]>([]);
  const [history, setHistory] = useState<TopicHistory[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    category: ''
  });
  const { user } = useAuth();

  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_debate_maestro')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setIsAdmin(Boolean((data as { is_debate_maestro?: boolean })?.is_debate_maestro));
      } catch (error) {
        logger.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Load topics and history
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Get active topics
        const active = await getActiveTopics();
        setActiveTopics(active);
        
        // Get topic history
        const historyData = await getTopicHistory();
        setHistory(historyData);
        
        // Get all topics
        const { data, error } = await supabase.from('topics').select('*');
        if (error) throw error;
        setAllTopics(data as unknown as Topic[]);
      } catch (error) {
        logger.error('Error loading topic data:', error);
        toast.error('Failed to load topic data');
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // Handle manually refreshing topics
  const handleRefresh = async () => {
    if (!apiKey) {
      toast.error('Please enter the admin API key');
      return;
    }
    
    try {
      setRefreshing(true);
      const result = await manuallyRefreshTopics(apiKey);
      
      if (result.success) {
        // Reload data after successful refresh
        const active = await getActiveTopics();
        setActiveTopics(active);
        
        const historyData = await getTopicHistory();
        setHistory(historyData);
      }
    } catch (error) {
      logger.error('Error refreshing topics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle adding a new topic
  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTopic.title || !newTopic.description || !newTopic.category) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      const result = await addTopic(newTopic);
      
      if (result) {
        // Reset form and reload topics
        setNewTopic({
          title: '',
          description: '',
          category: ''
        });
        setShowAddForm(false);
        
        // Update the list of all topics
        const { data, error } = await supabase.from('topics').select('*');
        if (error) throw error;
        setAllTopics(data as unknown as Topic[]);
      }
    } catch (error) {
      logger.error('Error adding topic:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h2>
        <p className="text-gray-700 dark:text-gray-300">
          You must be a debate maestro to access the topic administration panel.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/3"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Topic Administration</h2>
      
      {/* Active Topics Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Active Topics</h3>
        {activeTopics.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No active topics found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {activeTopics.map(topic => (
              <div key={topic.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800 dark:text-white">{topic.title}</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {topic.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{topic.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Topic Statistics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Total Topics</h4>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{allTopics.length}</p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Used Topics</h4>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {new Set(history.map(h => h.topic_id)).size}
          </p>
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">Available Topics</h4>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {allTopics.length - new Set(history.map(h => h.topic_id)).size}
          </p>
        </div>
      </div>
      
      {/* Manual Refresh Section */}
      <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Manual Topic Refresh</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter admin API key"
            className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refreshing ? 'Refreshing...' : 'Manually Refresh Topics'}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Warning: This will immediately replace the current active topics with 5 new ones.
        </p>
      </div>
      
      {/* Add New Topic Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Topic Management</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {showAddForm ? 'Cancel' : 'Add New Topic'}
          </button>
        </div>
        
        {showAddForm && (
          <form onSubmit={handleAddTopic} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={newTopic.title}
                onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter topic title"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={newTopic.description}
                onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter topic description"
                rows={3}
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={newTopic.category}
                onChange={(e) => setNewTopic({...newTopic, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter topic category"
                required
              />
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Topic
            </button>
          </form>
        )}
        
        {/* Topic List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {allTopics.map(topic => (
                <tr key={topic.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{topic.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{topic.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {topic.active ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(topic.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Topic History */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Topic History</h3>
        {history.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No history available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Topic ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Used On</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {entry.topic_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.used_on).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 