import React from 'react';

// type ChatContextType = {
//   chatClient: StreamChat<StreamChatGenerics> | null;
//   unreadCount: number;
// };

export const ChatContext = React.createContext({});

export const useChatContext = () => React.useContext(ChatContext);
