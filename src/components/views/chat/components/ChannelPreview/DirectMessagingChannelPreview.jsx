import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

// eslint-disable-next-line import/prefer-default-export
export function DirectMessagingChannelPreview({ channel, unread }) {
  const { client } = useChatContext();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID,
  );

  const unreadClassName = unread ? 'unread' : '';

  if (!members.length) return <div />;

  if (members.length === 1) {
    const member = members[0];
    return (
      <div className="channel-preview__item single">
        <Avatar
          image={member.user?.image}
          name={member.user?.name || member.user?.id}
          size={24}
        />
        <p className={unreadClassName}>{member?.user?.name || member?.user?.id}</p>
        {!!unread && unread > 0 && (
          <div className="channel-unread-container">
            <div className="channel-unread">
              {unread}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="channel-preview__item multi">
      <span>
        <Avatar
          image={members[0].user?.image}
          name={members[0].user?.name || members[0].user?.id}
          size={18}
        />
      </span>
      <div>
        {members?.length}
      </div>
      <p className={unreadClassName}>
        {members.map((member) => member.user?.name).join(', ')}
      </p>
      {!!unread && unread > 0 && (
        <div className="channel-unread-container">
          <div className="channel-unread">
            {unread}
          </div>
        </div>
      )}
    </div>
  );
}
