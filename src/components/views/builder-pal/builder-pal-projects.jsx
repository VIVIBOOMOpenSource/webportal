import React, {
  useEffect, useState, useCallback,
} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Player } from '@lottiefiles/react-lottie-player';

import './builder-pal-projects.scss';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import Loading from 'src/components/common/loading/loading';
import builderPalProjectAnim from 'src/css/lotties/builder-pal-project.json';
import builderPalLoadingAnim from 'src/css/lotties/builder-pal-loading.json';
import { ReactComponent as HomeSVG } from 'src/css/imgs/icon-home.svg';
import Button from 'src/components/common/button/button';
import BuilderPalProjectItem from './builder-pal-project-item';

const DEFAULT_LIMIT = 4;

export default function BuilderPalProjects() {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [isEndOfProjects, setIsEndOfProjects] = useState(false);
  const [projects, setProjects] = useState([]);

  const params = useParams();
  const history = useHistory();
  const { id } = params;

  const fetchProjects = useCallback(async (hardRefresh = false) => {
    if (!user?.authToken || loading) return;
    if (!hardRefresh && isEndOfProjects) return;
    setLoading(true);
    try {
      const requestParams = {
        authToken: user.authToken,
        limit: DEFAULT_LIMIT,
        offset: hardRefresh ? 0 : projects.length,
        chatId: id,
        shouldGenerateProject: true,
      };
      const res = await BuilderPalApi.getChatProjects(requestParams);
      if (hardRefresh) {
        setProjects(res.data?.projects);
      } else {
        setProjects((prev) => [...prev, ...(res.data?.projects || [])]);
      }
      if (res.data?.projects?.length < DEFAULT_LIMIT) {
        setIsEndOfProjects(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
    setLoading(false);
  }, [id, isEndOfProjects, loading, projects.length, user.authToken]);

  useEffect(() => {
    fetchProjects(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="builder-pal-projects">
      <div className="builder-pal">
        <h3 className="title">{t('Dream with BuilderPal!')}</h3>
        <div className="builder-pal-projects-container">
          <div className="project-prompt-container">
            <div className="project-prompt">
              {loading ? (
                <Player
                  autoplay
                  loop
                  src={builderPalLoadingAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              ) : (
                <Player
                  autoplay
                  loop
                  src={builderPalProjectAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              <h4 className="guiding-title">
                {t(loading ? 'Hold up a sec, tweaking project details in my mind!' : 'I dreamt up some fun projects. What do you think?')}
              </h4>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}/challenges`)}>{t('Related Viviboom challenges, now!')}</Button>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}/related-projects`)}>{t('Hit me with Viviboom projects')}</Button>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}`)}>{t('Uh... We should talk more')}</Button>
            </div>
            <Button parentClassName="home" onClick={() => history.push('/builderpal/home')}><HomeSVG /></Button>
          </div>
          <div className="projects-container">
            <div className="project-list">
              {projects.map((p) => (
                <BuilderPalProjectItem key={`builderpal-project_${p.id}`} project={p} />
              ))}
            </div>
            {loading && (
              <div className="loader-container">
                <Loading show size={18} />
                <p className="loader-text">{t('BuilderPal is thinking hard...')}</p>
              </div>
            )}
            {!loading && <Button parentClassName="load-more-button" onClick={() => fetchProjects(false)}>{t('Load More')}</Button>}
          </div>
        </div>
      </div>
    </div>
  );
}
