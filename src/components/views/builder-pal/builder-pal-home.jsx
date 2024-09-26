import React, {
  useEffect, useState, useCallback,
} from 'react';
import { toast } from 'react-toastify';

import './builder-pal-home.scss';
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from 'src/components/common/button/button';
import builderPalImg from 'src/css/imgs/builderpal-imgs/minichatavatar.png';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import Loading from 'src/components/common/loading/loading';
import { BuilderPalChatType } from 'src/enums/BuilderPalChatType';
import BuilderPalProjectItem from './builder-pal-project-item';

const DEFAULT_LIMIT = 4;

export default function BuilderPalHome() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);

  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);

  const [chats, setChats] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [isEndOfProjects, setIsEndOfProjects] = useState(false);

  const fetchChats = useCallback(async () => {
    setChatsLoading(true);
    try {
      const res = await BuilderPalApi.getList({ authToken: user.authToken, types: [BuilderPalChatType.CONVERSATIONAL, BuilderPalChatType.DISCOVERY, BuilderPalChatType.GUIDING], userId: user.id });
      setChats(res.data.chats);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
    setChatsLoading(false);
  }, [user?.authToken, user?.id]);

  const fetchProjects = useCallback(async (hardRefresh = false) => {
    if (!user?.authToken || loading) return;
    if (!hardRefresh && isEndOfProjects) return;
    setLoading(true);
    try {
      const requestParams = {
        authToken: user.authToken,
        limit: DEFAULT_LIMIT,
        offset: hardRefresh ? 0 : projects.length,
        isSaved: true,
      };
      const res = await BuilderPalApi.getProjects(requestParams);
      if (hardRefresh) {
        setProjects(res.data?.projects);
        setProjectCount(res.data?.count);
      } else {
        setProjects((prev) => [...prev, ...(res.data?.projects || [])]);
      }
      if (res.data?.projects?.length < DEFAULT_LIMIT) {
        setIsEndOfProjects(true);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [isEndOfProjects, loading, projects?.length, user?.authToken]);

  useEffect(() => {
    fetchProjects(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="builder-pal-home">
      <div className="builder-pal">
        <div className="builder-pal-home-container">
          <div className="builder-pal-chats-container">
            <div className="new-chat-container">
              <div className="user-status">
                <div className="user-status-avatar">
                  <div className="online-dot" />
                  <img className="image" alt="buiderpal" src={builderPalImg} />
                </div>
                <div>
                  <p className="user-status-title"><span className="bold">BuilderPal</span></p>
                  <p className="user-status-tag online">{t('Online')}</p>
                </div>
              </div>
              <Button parentClassName="new-chat" onClick={() => history.push('/builderpal')}>{t('New Chat +')}</Button>
            </div>
            <div className="builder-pal-chat-list">
              <p className="chat-list-title">
                {t('All Chats')}
                {' '}
                (
                {chats.length || 0}
                )
              </p>
              {chatsLoading && <div className="chat-item"><Loading show size={18} /></div>}
              {!chatsLoading && chats.map((v) => (
                <Link key={`builder-pal-chat_${v.id}`} className="chat-item" to={`/builderpal/${v.id}`}>
                  <p className="title-text">{v.title || '(No Title)'}</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="builder-pal-projects-container">
            <p className="project-list-title">
              {t('Favorite Projects')}
              <span style={{ color: '#aaa', marginLeft: '12px' }}>
                {projectCount}
              </span>
            </p>
            <div className="project-list">
              {projects.map((p) => (
                <BuilderPalProjectItem key={`builderpal-project_${p.id}`} chatId={p.chatId} project={p} hideSaveButton />
              ))}
            </div>
            {loading && (
              <div className="loader-container">
                <Loading show size={18} />
                <p className="loader-text">{t('BuilderPal is thinking hard...')}</p>
              </div>
            )}
            {(!loading && !isEndOfProjects) && <Button parentClassName="load-more-button" onClick={() => fetchProjects(false)}>{t('Load More')}</Button>}
            {(!loading && isEndOfProjects) && <p className="end-message">{t(!projects.length ? 'No projects detected. Start chatting to save your favorites!' : 'Yay! You have seen it all!')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
