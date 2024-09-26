import React, { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Player } from '@lottiefiles/react-lottie-player';

import builderPalImg from 'src/css/imgs/builderpal-imgs/minichatavatar.png';
import { ReactComponent as HomeSVG } from 'src/css/imgs/icon-home.svg';
import { ReactComponent as SendSVG } from 'src/css/imgs/icon-send.svg';
import { ReactComponent as RecordSVG } from 'src/css/imgs/icon-record.svg';
import { ReactComponent as KeyboardSVG } from 'src/css/imgs/icon-keyboard.svg';
import builderPalAnim from 'src/css/lotties/builder-pal.json';

import './chat-interface.scss';
import Button from 'src/components/common/button/button';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import { BuilderPalRoleType } from 'src/enums/BuilderPalRoleType';
import { ReactComponent as BackSvg } from 'src/css/imgs/icon-arrow-back.svg';
import Loading from 'src/components/common/loading/loading';
import { BuilderPalChatType } from 'src/enums/BuilderPalChatType';
import ChatMessage from './chat-message';
import RecordBar from './record-bar';

const guidingQuestions = [
  { key: 'standard', content: 'I have an idea of what I want built but need help', type: BuilderPalChatType.DISCOVERY },
  { key: 'guiding', content: 'I don\'t know what I want to build', type: BuilderPalChatType.GUIDING },
  { key: 'recommendation', content: 'Show me what I can build with materials available at VIVISTOP', type: BuilderPalChatType.DISCOVERY },
  { key: 'conversational', content: 'I just want to talk to you!', type: BuilderPalChatType.CONVERSATIONAL },
];

const DEFAULT_LIMIT = 20;

export default function ChatInterface({ chatId, hidePrompt, onRefresh }) {
  const { t } = useTranslation();
  const user = useSelector((state) => state?.user);
  const history = useHistory();

  // for mobile view only
  const [showChat, setShowChat] = useState(false);

  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [shouldRecommendProjects, setShouldRecommendProjects] = useState(false);

  const [scroll, setScroll] = useState(1); // for infinite scroll
  const [totalScrolls, setTotalScrolls] = useState(1);

  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  const [showRecordBar, setShowRecordBar] = useState(false);

  const [audioPermission, setAudioPermission] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!user.authToken || !chatId) return;
    const requestParams = {
      authToken: user.authToken,
      chatId,
      limit: DEFAULT_LIMIT,
    };

    try {
      const res = await BuilderPalApi.getMessages(requestParams);
      setMessages(res.data?.messages);
      setTotalScrolls(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  }, [user.authToken, chatId]);

  const fetchMoreMessages = useCallback(async () => {
    if (!user.authToken || !chatId) return;
    const requestParams = {
      authToken: user.authToken,
      chatId,
      limit: DEFAULT_LIMIT,
      offset: messages.length,
    };

    try {
      const res = await BuilderPalApi.getMessages(requestParams);
      setMessages([...messages, ...(res.data?.messages || [])]);
      setScroll((p) => p + 1);
      setTotalScrolls(res.data?.totalPages);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  }, [user.authToken, chatId, messages]);

  const sendMessage = async (content, type, audioBlob, duration) => {
    if (!user.authToken || (!content && !audioBlob) || !chatId) return;
    setMessages([
      {
        id: `assistant-message_${messages.length + 1}`, content: '', role: BuilderPalRoleType.ASSISTANT,
      },
      {
        id: `user-message_${messages.length}`, content, role: BuilderPalRoleType.USER, uri: audioBlob ? URL.createObjectURL(audioBlob) : undefined, duration,
      },
      ...messages,
    ]);
    try {
      setStreaming(true);
      const res = await BuilderPalApi.postMessage({
        authToken: user.authToken, chatId, text: content, type, audioBlob,
      });
      const streamReader = res.body.getReader();
      setMessages((prev) => [
        { ...prev[0], streamReader },
        ...prev.slice(1),
      ]);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const onClickSend = async () => {
    setText('');
    await sendMessage(text);
  };

  const onInputKeyPress = (e) => {
    if (e.key === 'Enter') onClickSend();
  };

  const getSuggestions = useCallback(async () => {
    if (!user.authToken || !chatId || hidePrompt) return;
    setSuggestionLoading(true);
    try {
      const res = await BuilderPalApi.getSuggestions({ authToken: user.authToken, chatId });
      setSuggestions(res.data.suggestions);
      if (res.data.shouldRecommendProjects !== undefined) setShouldRecommendProjects(res.data.shouldRecommendProjects);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
    setSuggestionLoading(false);
  }, [chatId, hidePrompt, user.authToken]);

  const onClickSuggestion = async (suggestion) => {
    await sendMessage(suggestion, BuilderPalChatType.DISCOVERY);
  };

  const onClickPromptQuestion = (question) => () => {
    if (question.key === 'recommendation') {
      history.push('/challenges');
    } else {
      sendMessage(question.content, question.type);
      setShowChat(true);
    }
  };

  const onClickMicrophone = async () => {
    if (showRecordBar) {
      setShowRecordBar(false);
    } else if ('MediaRecorder' in window) {
      if (!audioPermission) {
        try {
          await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          setAudioPermission(true);
          setShowRecordBar(true);
        } catch (err) {
          toast.error(err.message);
        }
      } else {
        setShowRecordBar(true);
      }
    } else {
      toast.error(t('The MediaRecorder API is not supported in your browser.'));
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!streaming) getSuggestions();
  }, [getSuggestions, streaming]);

  return (
    <div className="builder-pal-chat-container">
      {!hidePrompt && (
        <div className="chat-questions">
          <Player
            autoplay
            loop
            src={builderPalAnim}
            style={{ height: '300px', width: '300px' }}
          />
          <h4 className="guiding-title">
            {t('Let\'s make something together! Do you have an idea you want to bring to life?')}
          </h4>
          {guidingQuestions.map((q) => (
            <button key={q.key} className="guiding-question" type="button" onClick={onClickPromptQuestion(q)}>
              {t(q.content)}
            </button>
          ))}
        </div>
      )}
      <div className={`chat-section${showChat || hidePrompt ? '' : ' hide-section'}`}>
        <div className="builder-pal-chat-interface">
          <div className="chat-widget-header">
            <div className="user-status">
              {!hidePrompt && (<button type="button" className="chat-back-button" onClick={() => setShowChat(false)}><BackSvg /></button>)}
              <div className="user-status-avatar">
                <div className="online-dot" />
                <img className="image" alt="buiderpal" src={builderPalImg} />
              </div>
              <div>
                <p className="user-status-title"><span className="bold">BuilderPal</span></p>
                <p className="user-status-tag online">Online</p>
              </div>
            </div>
            <div className="top-buttons">
              <Button parentClassName="home" onClick={() => history.push('/builderpal/home')}><HomeSVG /></Button>
              {!hidePrompt && (<Button parentClassName="new-chat" onClick={onRefresh}>New Chat +</Button>)}
            </div>
          </div>
          <div className="messages" id="scrollableMessageDiv">
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchMoreMessages}
              style={{
                display: 'flex', flexDirection: 'column-reverse', overflow: 'hidden', alignItems: 'center',
              }} // To put endMessage and loader to the top.
              inverse
              hasMore={scroll < totalScrolls}
              loader={<div className="message-loader"><Loading show size="24px" /></div>}
              scrollableTarget="scrollableMessageDiv"
            >
              {messages.map((message) => (
                <ChatMessage key={`message-${message.id}`} message={message} setLoading={setStreaming} />
              ))}
            </InfiniteScroll>
          </div>
          {!streaming && !hidePrompt && (
            <div className="suggestions">
              {suggestionLoading && (
                <div className="suggestion-loading">
                  <Loading show size="16px" />
                  <div className="suggestion-loading-text">
                    {t('Thinking and suggesting...')}
                  </div>
                </div>
              )}
              {!suggestionLoading && !shouldRecommendProjects && suggestions.slice(0, 3).map((v) => (
                <button key={`suggestion-${v}`} type="button" className="suggestion" onClick={() => onClickSuggestion(v)}>
                  {v}
                </button>
              ))}
              {!suggestionLoading && shouldRecommendProjects && (
                <>
                  <button type="button" className="suggestion" onClick={() => history.push(`/builderpal/${chatId}/challenges`)}>
                    {t('Reveal related Challenges!')}
                  </button>
                  <button type="button" className="suggestion" onClick={() => history.push(`/builderpal/${chatId}/related-projects`)}>
                    {t('Hit me with related Projects!')}
                  </button>
                  <button type="button" className="suggestion" onClick={() => history.push(`/builderpal/${chatId}/projects`)}>
                    {t('Dream up projects for me!')}
                  </button>
                </>
              )}
            </div>
          )}
          <div className="user-input">
            {showRecordBar ? (
              <RecordBar sendMessage={sendMessage} />
            ) : (
              <input className="text-input" placeholder={t('Write a message...')} value={text} onChange={(e) => setText(e.target.value)} maxLength={100} onKeyUp={onInputKeyPress} />
            )}
            <div className="interactive-buttons">
              <Button parentClassName="interactive-button" onClick={onClickSend} disabled={streaming || showRecordBar}><SendSVG /></Button>
              <Button parentClassName="interactive-button" onClick={onClickMicrophone}>{showRecordBar ? <KeyboardSVG /> : <RecordSVG />}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
