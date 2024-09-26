import React, { useCallback } from 'react';
import { useChatContext } from 'stream-chat-react';

import { DirectMessagingChannelPreview } from './DirectMessagingChannelPreview';
import { TeamChannelPreview } from './TeamChannelPreview';

import { useWorkspaceController } from '../../context/WorkspaceController';

// eslint-disable-next-line import/prefer-default-export
export function ChannelPreview({ channel, type, unread }) {
  const { channel: activeChannel, setActiveChannel } = useChatContext();
  const { displayWorkspace } = useWorkspaceController();

  const handleClick = useCallback(() => {
    displayWorkspace('Chat');
    if (setActiveChannel) {
      setActiveChannel(channel);
    }
  }, [channel, displayWorkspace, setActiveChannel]);

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      className={`channel-preview ${channel?.id === activeChannel?.id ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {type === 'team'
        ? <TeamChannelPreview name={channel?.data?.name || channel?.data?.id || 'random'} isUnread={!!unread} />
        : <DirectMessagingChannelPreview channel={channel} unread={unread} />}
    </button>
  );
}
