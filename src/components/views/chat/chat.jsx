import React from 'react';
import { Chat, enTranslations, Streami18n } from 'stream-chat-react';

import { ChannelContainer } from './components/ChannelContainer/ChannelContainer';
import { Sidebar } from './components/Sidebar/Sidebar';

import { WorkspaceController } from './context/WorkspaceController';
import './styles/index.scss';
import { useChatContext } from './context/ChatContext';

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
  },
});

function ChatComponent() {
  const { chatClient } = useChatContext();

  return !!chatClient && (
    <div className="app__wrapper str-chat" id="chat-root">
      <div className="chat-container">
        <Chat {...{ client: chatClient, i18nInstance }} theme="team">
          <WorkspaceController>
            <Sidebar />
            <ChannelContainer />
          </WorkspaceController>
        </Chat>
      </div>
    </div>
  );
}

export default ChatComponent;
