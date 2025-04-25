import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  
  // Check current user and fetch online members
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
    const channel = supabase.channel('online-users');
    
    // Track when users come online or go offline
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        updateMembersStatus(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // User came online, update their status
        updateMemberStatus(key, 'online');
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // User went offline, update their status
        updateMemberStatus(key, 'offline');
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && currentUser) {
          // When successfully subscribed, track our own presence
          await channel.track({
            user_id: currentUser.id,
            online_at: new Date().toISOString(),
          });
        }
      });
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialMembers, topicId]);
  
  // Fetch online members from Supabase
  const fetchOnlineMembers = async () => {
    if (!topicId) return;
    
    try {
      // In a real app, you'd query for users in this topic/circle
      const { data, error } = await supabase
        .from('topic_members')
        .select('user_id, users(id, full_name, avatar_url, user_metadata)')
        .eq('topic_id', topicId);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Transform users to member format
        const onlineMembers = data.map(record => {
          const user = record.users;
          return {
            id: user.id,
            name: user.full_name || 'Anonymous',
            avatar: user.avatar_url || user.full_name?.charAt(0) || 'A',
            status: 'online',
            role: user.user_metadata?.role || 'member'
          };
        });
        
        // Combine with existing members, prioritizing online status
        const combinedMembers = [...initialMembers];
        
        onlineMembers.forEach(onlineMember => {
          const existingIndex = combinedMembers.findIndex(m => m.id === onlineMember.id);
          if (existingIndex >= 0) {
            combinedMembers[existingIndex] = {
              ...combinedMembers[existingIndex],
              status: 'online'
            };
          } else {
            combinedMembers.push(onlineMember);
          }
        });
        
        setMembers(combinedMembers);
      }
    } catch (error) {
      console.error('Error fetching online members:', error);
    }
  };
  
  // Update members status from presence state
  const updateMembersStatus = (state: any) => {
    const updatedMembers = [...members];
    
    // For each user in the presence state
    Object.keys(state).forEach(userId => {
      updateMemberStatus(userId, 'online');
    });
    
    setMembers(updatedMembers);
  };
  
  // Update a single member's status
  const updateMemberStatus = (userId: string, status: 'online' | 'idle' | 'dnd' | 'offline') => {
    setMembers(currentMembers => {
      return currentMembers.map(member => {
        if (member.id === userId) {
          return { ...member, status };
        }
        return member;
      });
    });
  };
  
  // Group members by role
  const groupedMembers = members.reduce((groups, member) => {
    const role = member.role || 'member';
    if (!groups[role]) {
      groups[role] = [];
    }
    groups[role].push(member);
    return groups;
  }, {} as Record<string, Member[]>);
  
  // Sort roles in order
  const sortedRoles = ['owner', 'admin', 'moderator', 'member'].filter(role => groupedMembers[role]);
  
  const handleMemberClick = (memberId: string) => {
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
      console.error('Error setting up direct message:', error);
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
      console.error('Failed to copy mention to clipboard:', err);
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
  
  return (
    <div className="members-container bg-background-secondary w-60 h-screen hidden md:block overflow-y-auto">
      <div className="members-header p-4 border-b border-background-tertiary">
        <h3 className="text-text-muted text-sm font-semibold uppercase tracking-wide">Members - {members.length}</h3>
      </div>
      
      <div className="members-list p-4">
        {sortedRoles.map(role => (
          <div key={role} className="member-category mb-6">
            <h4 className={`text-xs mb-2 ${getRoleColor(role)} uppercase font-semibold`}>
              {role === 'member' ? 'Members' : `${role}s`} - {groupedMembers[role].length}
            </h4>
            <div className="space-y-2">
              {groupedMembers[role].map(member => (
                <div key={member.id} className="relative">
                  <div 
                    className="member-item flex items-center p-2 rounded-md hover:bg-background-primary cursor-pointer"
                    onClick={() => handleMemberClick(member.id)}
                  >
                    <div className="member-avatar w-8 h-8 rounded-full bg-background-tertiary flex items-center justify-center relative">
                      {typeof member.avatar === 'string' && member.avatar.length === 1 ? (
                        <span className="text-text-primary font-semibold">{member.avatar}</span>
                      ) : (
                        <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                      )}
                      {renderMemberStatus(member.status)}
                    </div>
                    <div className="member-name ml-2 flex-1">
                      <div className={`font-medium ${member.isBot ? 'text-green-400' : 'text-text-primary'}`}>
                        {member.name}
                        {member.isBot && <span className="text-xs ml-1 bg-green-400 text-black px-1 rounded">BOT</span>}
                      </div>
                    </div>
                  </div>
                  
                  {/* Profile popup */}
                  {activeProfile === member.id && (
                    <div className="profile-popup absolute left-0 mt-1 w-48 bg-background-tertiary rounded-md shadow-lg z-10">
                      <div className="profile-header p-3 border-b border-background-primary text-center">
                        <div className="flex justify-center mb-2">
                          <div className="member-avatar w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center relative">
                            {typeof member.avatar === 'string' && member.avatar.length === 1 ? (
                              <span className="text-text-primary font-semibold text-lg">{member.avatar}</span>
                            ) : (
                              <img src={member.avatar} alt={member.name} className="w-full h-full rounded-full" />
                            )}
                            {renderMemberStatus(member.status)}
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