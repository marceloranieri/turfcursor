'use client';

import logger from '@/lib/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import toast from 'react-hot-toast';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data?.map((todo: any) => ({
        id: todo.id,
        text: todo.title,
        completed: todo.completed,
        createdAt: new Date(todo.created_at)
      })) || []);
    } catch (error) {
      logger.error('Error fetching todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [user, fetchTodos]);

  const addTodo = async () => {
    if (inputValue.trim() && user) {
      try {
        const newTodoItem = {
          title: inputValue.trim(),
          user_id: user.id,
          completed: false
        };

        const { data, error } = await supabase
          .from('todos')
          .insert([newTodoItem])
          .select();

        if (error) throw error;
        
        if (data) {
          const mappedTodos = data.map((todo: any) => ({
            id: todo.id,
            text: todo.title,
            completed: todo.completed,
            createdAt: new Date(todo.created_at)
          }));
          setTodos([...mappedTodos, ...todos]);
          toast.success('Task added!');
        }
        
        setInputValue('');
      } catch (error) {
        logger.error('Error adding todo:', error);
        toast.error('Failed to add task');
      }
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todoToUpdate.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(
        todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (error) {
      logger.error('Error updating todo:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));
      toast.success('Task removed');
    } catch (error) {
      logger.error('Error deleting todo:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Todo List</h2>
        <div className="animate-pulse">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Todo List</h2>
      
      {user ? (
        <>
          <div className="flex mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task..."
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button 
              onClick={addTodo}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {todos.length === 0 ? (
              <li className="text-gray-500 dark:text-gray-400 text-center py-2">No tasks yet</li>
            ) : (
              todos.map(todo => (
                <li 
                  key={todo.id} 
                  className="flex items-center p-2 border border-gray-200 dark:border-gray-700 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 text-blue-500 mr-2"
                  />
                  <span 
                    className={`flex-grow ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="mb-4 text-gray-600 dark:text-gray-400">Please sign in to manage your tasks</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
} 