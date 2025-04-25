import React from 'react';

interface Member {
  id: string;
  name: string;
  role?: string;
  status: string;
  avatar: string;
  isBot?: boolean;
}

interface MembersListProps {
  members: Member[];
}

const MembersList = ({ members }: MembersListProps) => {
  // Filter bot members
  const botMembers = members.filter(member => member.isBot);
  // Filter online human members
  const onlineMembers = members.filter(member => !member.isBot && member.status === 'online');
  
  return (
    <div className="members-list bg-background-secondary w-60 h-screen overflow-y-auto fixed right-0 top-0 px-3">
      {/* Bots Section */}
      {botMembers.length > 0 && (
        <>
          <div className="members-header text-xs font-semibold text-text-muted uppercase px-2 py-3">
            Bots — {botMembers.length}
          </div>
          
          <div className="member-group mb-4">
            {botMembers.map(member => (
              <div key={member.id} className="member flex items-center py-1 px-2 hover:bg-background-tertiary rounded cursor-pointer">
                <div className="member-avatar w-8 h-8 rounded-full bg-[#43b581] flex items-center justify-center text-white font-bold mr-3">
                  {member.avatar}
                </div>
                <div className="member-info">
                  <div className="member-name text-[#43b581] text-sm font-medium">{member.name}</div>
                  {member.role && <div className="member-role text-text-muted text-xs">{member.role}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Online Members Section */}
      {onlineMembers.length > 0 && (
        <>
          <div className="members-header text-xs font-semibold text-text-muted uppercase px-2 py-3">
            Online — {onlineMembers.length}
          </div>
          
          <div className="member-group">
            {onlineMembers.map(member => (
              <div key={member.id} className="member flex items-center py-1 px-2 hover:bg-background-tertiary rounded cursor-pointer">
                <div className="member-avatar w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center text-white font-bold mr-3">
                  {member.avatar}
                </div>
                <div className="member-info">
                  <div className="member-name text-text-primary text-sm font-medium">{member.name}</div>
                  {member.role && <div className="member-role text-text-muted text-xs">{member.role}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MembersList; 