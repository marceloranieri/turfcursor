import logger from '@/lib/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Member {
  id: string;
  name: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  avatar: string;
  isBot?: boolean;
  role?: 'owner' | 'admin' | 'moderator' | 'member';
}

interface MembersListProps {
  members: Member[];
  topicId?: string;
}

const MembersList = ({ members: initialMembers, topicId }: MembersListProps) => {
  const router = useRouter();
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Update a single member's status
  const updateMemberStatus = useCallback((userId: string, status: 'online' | 'idle' | 'dnd' | 'offline') => {
    setMembers(currentMembers => {
      return currentMembers.map(member => {
        if (member.id === userId) {
          return { ...member, status };
        }
        return member;
      });
    });
  }, []);
  
  // Fetch online members from Supabase
  const fetchOnlineMembers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('online_members')
        .select('*')
        .eq('topic_id', topicId);

      if (error) throw error;

      // Update member status
      const updatedMembers = members.map(member => ({
        ...member,
        status: data?.some(online => online.user_id === member.id) ? 'online' as const : 'offline' as const
      }));

      setMembers(updatedMembers);
    } catch (error) {
      logger.error('Error fetching online members:', error);
    } finally {
      setIsLoading(false);
    }
  }, [members, topicId]);
  
  // Check current user and set up presence subscription
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    
    checkAuth();
    setMembers(initialMembers);
    
    if (topicId) {
      fetchOnlineMembers();
    }
    
    // Set up presence channel for real-time online status
    const channel = supabase
      .channel('presence')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        Object.keys(state).forEach(userId => {
          updateMemberStatus(userId, 'online');
        });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialMembers, topicId, fetchOnlineMembers, updateMemberStatus]);
  
  // Set up online members subscription
  useEffect(() => {
    if (!topicId) return;

    const channel = supabase
      .channel('online_members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'online_members' }, () => {
        fetchOnlineMembers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId, fetchOnlineMembers]);
  
  // Group members by role
  const groupedMembers = members.reduce((groups, member) => {
    const role = member.role || 'member';
    if (!groups[role]) {
      groups[role] = [];
    }
    (groups[role] as Member[]).push(member);
    return groups;
  }, {} as Record<string, Member[]>);
  
  // Sort roles in order
  const sortedRoles = ['owner', 'admin', 'moderator', 'member'].filter(role => groupedMembers[role]);
  
  const handleMemberClick = (memberId: string) => {
    logger.info("Member clicked:", memberId);
    // Toggle profile popup
    setActiveProfile(activeProfile === memberId ? null : memberId);
  };
  
  const handleSendMessage = async (memberId: string) => {
    if (!currentUser) {
      alert('You need to sign in to send direct messages');
      return;
    }
    
    try {
      // Check if a DM channel already exists
      const { data: existingChannel, error: channelError } = await supabase
        .from('dm_channels')
        .select('*')
        .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`)
        .or(`user1_id.eq.${memberId},user2_id.eq.${memberId}`)
        .maybeSingle();
      
      if (channelError) throw channelError;
      
      let channelId;
      
      if (existingChannel) {
        channelId = existingChannel.id;
      } else {
        // Create a new DM channel
        const { data: newChannel, error: createError } = await supabase
          .from('dm_channels')
          .insert({
            user1_id: currentUser.id,
            user2_id: memberId,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (createError) throw createError;
        channelId = newChannel.id;
      }
      
      // Navigate to the DM channel
      router.push(`/messages/${channelId}`);
    } catch (error) {
      logger.error('Error setting up direct message:', error);
      alert('Failed to open direct message. Please try again.');
    }
    
    setActiveProfile(null);
  };
  
  const handleViewProfile = (memberId: string) => {
    router.push(`/profile/${memberId}`);
    setActiveProfile(null);
  };
  
  const handleMention = (memberId: string, name: string) => {
    // Create a custom event to notify the chat area
    const mentionEvent = new CustomEvent('user-mention', { 
      detail: { userId: memberId, username: name }
    });
    document.dispatchEvent(mentionEvent);
    
    // Also copy to clipboard as a fallback
    navigator.clipboard.writeText(`@${name}`).catch(err => {
      logger.error('Failed to copy mention to clipboard:', err);
    });
    
    setActiveProfile(null);
  };
  
  const renderMemberStatus = (status: string) => {
    switch (status) {
      case 'online':
        return <div className="status-indicator w-3 h-3 rounded-full bg-green-500 absolute bottom-0 right-0 border-2 border-background-primary"></div>;
      case 'idle':
        return <div className="status-indicator w-3 h-3 rounded-full bg-yellow-500 absolute bottom-0 right-0 border-2 border-background-primary"></div>;
      case 'dnd':
        return <div className="status-indicator w-3 h-3 rounded-full bg-red-500 absolute bottom-0 right-0 border-2 border-background-primary"></div>;
      default:
        return <div className="status-indicator w-3 h-3 rounded-full bg-gray-500 absolute bottom-0 right-0 border-2 border-background-primary"></div>;
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'text-red-400';
      case 'admin':
        return 'text-orange-400';
      case 'moderator':
        return 'text-blue-400';
      default:
        return 'text-text-muted';
    }
  };

  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'dnd':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="members-container bg-background-secondary w-60 h-screen hidden md:block overflow-y-auto">
      <div className="members-header p-4 border-b border-background-tertiary">
        <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wide">Members - {members.length}</h3>
      </div>
      
      <div className="members-list p-4">
        {sortedRoles.map(role => (
          <div key={role} className="member-category mb-6">
            <h4 className={`text-xs mb-2 ${getRoleColor(role)} uppercase font-semibold`}>
              {role === 'member' ? 'Members' : `${role}s`} - {(groupedMembers[role] || []).length}
            </h4>
            <div className="space-y-2">
              {(groupedMembers[role] || []).map(member => (
                <div key={member.id} className="relative">
                  <div 
                    className="member-item flex items-center p-2 rounded-md hover:bg-background-primary cursor-pointer border border-transparent hover:border-background-primary transition-all"
                    onClick={() => handleMemberClick(member.id)}
                  >
                    <div className="member-avatar w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center relative">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{member.name}</span>
                            {member.role && (
                              <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(member.role)}`}>
                                {member.role}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-text-muted">
                            {member.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile popup */}
                  {activeProfile === member.id && (
                    <div className="profile-popup absolute z-50 left-0 mt-1 w-48 bg-background-tertiary rounded-md shadow-lg border border-background-primary">
                      <div className="profile-header p-3 border-b border-background-primary text-center">
                        <div className="flex justify-center mb-2">
                          <div className="member-avatar w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center relative">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <Image
                                  src={member.avatar}
                                  alt={member.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{member.name}</span>
                                  {member.role && (
                                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(member.role)}`}>
                                      {member.role}
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-text-muted">
                                  {member.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`font-semibold ${member.isBot ? 'text-green-400' : 'text-text-primary'}`}>
                          {member.name}
                        </div>
                        <div className={`text-xs ${getRoleColor(member.role || 'member')}`}>
                          {member.role || 'Member'}
                        </div>
                      </div>
                      <div className="profile-actions p-1">
                        <div 
                          className="action-item p-2 hover:bg-background-primary rounded-md cursor-pointer flex items-center"
                          onClick={() => handleSendMessage(member.id)}
                        >
                          <span className="mr-2">✉️</span>
                          <span>Message</span>
                        </div>
                        <div 
                          className="action-item p-2 hover:bg-background-primary rounded-md cursor-pointer flex items-center"
                          onClick={() => handleMention(member.id, member.name)}
                        >
                          <span className="mr-2">@</span>
                          <span>Mention</span>
                        </div>
                        <div 
                          className="action-item p-2 hover:bg-background-primary rounded-md cursor-pointer flex items-center"
                          onClick={() => handleViewProfile(member.id)}
                        >
                          <span className="mr-2">👤</span>
                          <span>View Profile</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList; 