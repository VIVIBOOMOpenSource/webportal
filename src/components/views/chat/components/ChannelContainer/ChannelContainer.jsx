import React from 'react';
import { Channel, SimpleReactionsList, useChatContext } from 'stream-chat-react';

import { AdminPanel } from '../AdminPanel/AdminPanel';
import { ChannelInner } from './ChannelInner';
import { EmptyChannel } from '../EmptyChannel/EmptyChannel';
import { TeamMessageInput } from '../TeamMessageInput/TeamMessageInput';
import { TeamTypingIndicator } from '../TeamTypingIndicator/TeamTypingIndicator';
import { ThreadHeader } from '../TeamChannelHeader/ThreadHeader';
import { TeamMessage } from '../TeamMessage/TeamMessage';

import { GiphyInMessageFlagProvider } from '../../context/GiphyInMessageFlagContext';
import { useWorkspaceController } from '../../context/WorkspaceController';

function LoadingIndicator() {
  return null;
}

// eslint-disable-next-line import/prefer-default-export
export function ChannelContainer() {
  const { activeWorkspace } = useWorkspaceController();
  const { channel } = useChatContext();

  if (activeWorkspace.match('Admin')) {
    return <AdminPanel />;
  }

  return (
    <div className={`channel__container ${channel ? '' : 'hide'}`}>
      <Channel
        EmptyStateIndicator={EmptyChannel}
        LoadingIndicator={LoadingIndicator}
        Input={TeamMessageInput}
        Message={TeamMessage}
        ReactionsList={SimpleReactionsList}
        ThreadHeader={ThreadHeader}
        TypingIndicator={TeamTypingIndicator}
      >
        <GiphyInMessageFlagProvider>
          <ChannelInner />
        </GiphyInMessageFlagProvider>
      </Channel>
    </div>
  );
}
