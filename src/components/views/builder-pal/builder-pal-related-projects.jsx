import React, {
  useEffect, useState, useCallback,
} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Player } from '@lottiefiles/react-lottie-player';

import './builder-pal-related-projects.scss';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';
import Loading from 'src/components/common/loading/loading';
import builderPalProjectAnim from 'src/css/lotties/builder-pal-project.json';
import builderPalLoadingAnim from 'src/css/lotties/builder-pal-loading.json';
import builderPalNoResultAnim from 'src/css/lotties/builder-pal-no-result.json';
import { ReactComponent as HomeSVG } from 'src/css/imgs/icon-home.svg';
import Button from 'src/components/common/button/button';
import ProjectItem from '../projects/project-item';

const DEFAULT_LIMIT = 6;

export default function BuilderPalRelatedProjects() {
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
      };
      const res = await BuilderPalApi.getRelatedProjects(requestParams);
      if (hardRefresh) {
        setProjects(res.data?.projects);
      } else {
        setProjects((prev) => [...prev, ...(res.data?.projects || [])]);
      }
      if (res.data.projects.length < DEFAULT_LIMIT) {
        setIsEndOfProjects(true);
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [id, isEndOfProjects, loading, projects.length, user.authToken]);

  useEffect(() => {
    fetchProjects(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmptyResult = !projects.length && isEndOfProjects;

  return (
    <div className="builder-pal-related-projects">
      <div className="builder-pal">
        <h3 className="title">{t('Dream with BuilderPal!')}</h3>
        <div className="builder-pal-related-projects-container">
          <div className="project-prompt-container">
            <div className="project-prompt">
              {isEmptyResult && (
                <Player
                  autoplay
                  loop
                  src={builderPalNoResultAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              {!isEmptyResult && loading && (
                <Player
                  autoplay
                  loop
                  src={builderPalLoadingAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              {!isEmptyResult && !loading && (
                <Player
                  autoplay
                  loop
                  src={builderPalProjectAnim}
                  style={{ height: '240px', width: '240px' }}
                />
              )}
              <h4 className="guiding-title">
                {isEmptyResult ? 'Oops, no luck finding a perfect match on Viviboom. Shall we dream up some projects?' : `${loading ? 'Wait a moment, diving into the Viviboom project pool!' : 'Hey, Check out these cool Viviboom projects! 😊'}`}
              </h4>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}/challenges`)}>{t('Related Viviboom challenges, now!')}</Button>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}/projects`)}>{t('Dream up some project for me')}</Button>
              <Button parentClassName="prompt-button" onClick={() => history.push(`/builderpal/${id}`)}>{t('Uh... We should talk more')}</Button>
            </div>
            <Button parentClassName="home" onClick={() => history.push('/builderpal/home')}><HomeSVG /></Button>
          </div>
          <div className="projects-container">
            <div className="project-list">
              {projects.map((v) => <ProjectItem key={`builderpal-related-project_${v.id}`} id={v.id} preloadedData={v} />)}
            </div>
            {loading && (
              <div className="loader-container">
                <Loading show size={18} />
                <p className="loader-text">{t('BuilderPal is thinking hard...')}</p>
              </div>
            )}
            {(!loading && !isEndOfProjects) && <Button parentClassName="load-more-button" onClick={() => fetchProjects(false)}>{t('Load More')}</Button>}
            {(!loading && isEndOfProjects) && <p className="end-message">{t(isEmptyResult ? 'No related project found on Viviboom' : 'Yay! You have seen it all!')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
