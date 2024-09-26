import { useCallback, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useSelector } from 'react-redux';
import ChatApi from 'src/apis/viviboom/ChatApi';
import Config from 'src/config';

// eslint-disable-next-line import/prefer-default-export
export const useChatClient = () => {
  const account = useSelector((state) => state?.user);
  const [chatClient, setChatClient] = useState(null);
  const [unreadCount, setUnreadCount] = useState();

  const chatLogin = useCallback(async () => {
    try {
      const res = await ChatApi.getAuthToken({ authToken: account.authToken });
      const { streamChatAuthToken } = res.data;
      const client = StreamChat.getInstance(Config.Common.StreamChatAppKey);
      const connectedUser = await client.connectUser({ id: String(account.id) }, streamChatAuthToken);
      const initialUnreadCount = connectedUser?.me?.total_unread_count;
      setUnreadCount(initialUnreadCount);
      setChatClient(client);
    } catch (err) {
      console.error(err);
    }
  }, [account.authToken, account.id]);

  const chatLogout = useCallback(async () => {
    if (chatClient) {
      await chatClient?.disconnectUser();
      setChatClient(null);
    }
  }, [chatClient]);

  // login to chat
  useEffect(() => {
    if (account.authToken && account.institution?.isChatEnabled) chatLogin();
  }, [account?.authToken, account?.institution?.isChatEnabled, chatLogin]);

  useEffect(() => {
    // clean up
    if (!account?.authToken) chatLogout();
  }, [account?.authToken, chatLogout]);

  /**
   * Listen to changes in unread counts and update the badge count
   */
  useEffect(() => {
    const listener = chatClient?.on((e) => {
      if (e.total_unread_count !== undefined) {
        setUnreadCount(e.total_unread_count);
      }
    });

    return () => {
      if (listener) {
        listener.unsubscribe();
      }
    };
  }, [chatClient]);

  return {
    chatClient,
    unreadCount,
  };
};
