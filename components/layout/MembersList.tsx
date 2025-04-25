import React, { useState } from 'react';

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
}

const MembersList = ({ members }: MembersListProps) => {
  const [activeProfile, setActiveProfile] = useState<string | null>(null);
  
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
  
  const handleSendMessage = (memberId: string) => {
    alert(`Private message would be sent to member ${memberId}`);
    setActiveProfile(null);
  };
  
  const handleViewProfile = (memberId: string) => {
    alert(`View profile of member ${memberId}`);
    setActiveProfile(null);
  };
  
  const handleMention = (memberId: string, name: string) => {
    alert(`@${name} would be inserted into the message input`);
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