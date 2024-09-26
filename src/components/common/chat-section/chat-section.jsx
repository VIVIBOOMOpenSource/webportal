import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import ChatApi from 'src/apis/viviboom/ChatApi';
import './chat-section.scss';
import Button from '../button/button';

function ChatSection({ targetUsers, user }) {
  const { t } = useTranslation('translation', { keyPrefix: 'common' });
  // const [apiKey, setApiKey] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    setSendMessageLoading(true);
    try {
      await ChatApi.postMessage({
        authToken: user.authToken,
        receivers: targetUsers.map((targetUser) => targetUser.id),
        text: message,
      });
      toast.success(targetUsers.length > 1 ? t('sentMessage') : t('sentMessageTo', { name: targetUsers[0].name }));
      setMessage('');
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
    setSendMessageLoading(false);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-section">
        <textarea
          id="member-chat"
          className="search"
          placeholder={t('Type anything here')}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>
      <div className="submit-chat-button">
        <Button
          type="submit"
          status={sendMessageLoading ? 'loading' : 'sent'}
          value={t('Send')}
          onClick={sendMessage}
        />
      </div>
    </div>
  );
}

export default ChatSection;
