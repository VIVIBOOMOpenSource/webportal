import React, {
  useEffect, useState, useCallback,
} from 'react';
import { toast } from 'react-toastify';

import './builder-pal-chat.scss';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import { BuilderPalChatType } from 'src/enums/BuilderPalChatType';
import { useSelector } from 'react-redux';
import ChatInterface from './chat-interface';

export default function BuilderPalChat() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);

  const [chat, setChat] = useState();

  const params = useParams();
  const history = useHistory();
  const { id } = params;

  const loadChat = useCallback(async () => {
    try {
      let chatId = id;
      if (!id) {
        const res = await BuilderPalApi.post({ authToken: user.authToken, type: BuilderPalChatType.DISCOVERY });
        chatId = res?.data?.chatId;
      }
      const chatResults = await BuilderPalApi.get({ authToken: user.authToken, chatId });
      setChat(chatResults.data.chat);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, [id, user.authToken]);

  const onRefresh = () => {
    if (!id) {
      loadChat();
    } else {
      history.push('/builderpal');
    }
  };

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  return (
    <div className="builder-pal-chat">
      <div className="builder-pal">
        <h3 className="title">{t('Chat with BuilderPal')}</h3>
        <ChatInterface chatId={chat?.id} onRefresh={onRefresh} />
      </div>
    </div>
  );
}
