import React, { useCallback } from 'react';
import { logChatPromiseExecution } from 'stream-chat';
import {
  defaultPinPermissions,
  MessageInput,
  MessageList,
  Thread,
  useChannelActionContext,
  Window,
} from 'stream-chat-react';

import { PinnedMessageList } from '../PinnedMessageList/PinnedMessageList';
import { TeamChannelHeader } from '../TeamChannelHeader/TeamChannelHeader';
import { ThreadMessageInput } from '../TeamMessageInput/ThreadMessageInput';

import { useGiphyInMessageContext } from '../../context/GiphyInMessageFlagContext';

// eslint-disable-next-line import/prefer-default-export
export function ChannelInner() {
  const { inputHasGiphyMessage, clearGiphyFlag } = useGiphyInMessageContext();
  const { sendMessage } = useChannelActionContext();

  // todo: migrate to channel capabilities once migration guide is available
  const teamPermissions = { ...defaultPinPermissions.team, user: true };
  const messagingPermissions = {
    ...defaultPinPermissions.messaging,
    user: true,
  };

  const pinnedPermissions = {
    ...defaultPinPermissions,
    team: teamPermissions,
    messaging: messagingPermissions,
  };

  const overrideSubmitHandler = useCallback((message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    const isReply = !!updatedMessage.parent_id;

    if (inputHasGiphyMessage(isReply)) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...updatedMessage, text: updatedText };
    }

    if (sendMessage) {
      const sendMessagePromise = sendMessage(updatedMessage);
      logChatPromiseExecution(sendMessagePromise, 'send message');
      clearGiphyFlag(isReply);
    }
  }, [inputHasGiphyMessage, sendMessage, clearGiphyFlag]);

  return (
    <>
      <Window>
        <TeamChannelHeader />
        <MessageList disableQuotedMessages pinPermissions={pinnedPermissions} />
        <MessageInput grow overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread additionalMessageInputProps={{ grow: true, Input: ThreadMessageInput, overrideSubmitHandler }} />
      <PinnedMessageList />
    </>
  );
}
