import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import MyImage from 'src/components/common/MyImage';
import './builder-pal-project-item.scss';

import DefaultBeginnerPicture from 'src/css/imgs/boom-imgs/quest/cover/03.png';
import DefaultIntermediatePicture from 'src/css/imgs/boom-imgs/quest/cover/02.png';
import DefaultAdvancedPicture from 'src/css/imgs/boom-imgs/quest/cover/01.png';
import Star from 'src/css/imgs/icon-star.png';
import StarOutline from 'src/css/imgs/icon-star-outline.png';
import Clock from 'src/css/imgs/icon-clock.png';
import { ReactComponent as HeartSvg } from 'src/css/imgs/icon-heart-outline.svg';
import BuilderPalApi from 'src/apis/viviboom/BuilderPalApi';

const DEFAULT_CHALLENGE_IMAGE_SIZE = 256;

const difficultyLevels = {
  BEGINNER: {
    stars: [Star, StarOutline, StarOutline],
    label: 'Beginner',
    defaultBackgroundImage: DefaultBeginnerPicture,
  },
  INTERMEDIATE: {
    stars: [Star, Star, StarOutline],
    label: 'Intermediate',
    defaultBackgroundImage: DefaultIntermediatePicture,
  },
  ADVANCED: {
    stars: [Star, Star, Star],
    label: 'Advanced',
    defaultBackgroundImage: DefaultAdvancedPicture,
  },
};

function BuilderPalProjectItem({ project, hideSaveButton }) {
  const { t } = useTranslation('translation', { keyPrefix: 'challenges' });
  const user = useSelector((state) => state?.user);

  const [isUserSaved, setUserSaved] = useState(project?.isSaved);

  const saveToggle = async (e) => {
    e.preventDefault();
    try {
      await BuilderPalApi.patchProject({
        authToken: user.authToken, chatId: project.chatId, projectId: project?.id, isSaved: !isUserSaved,
      });
      if (!isUserSaved) toast.success('Project Added to Favorites!');
      setUserSaved((b) => !b);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };

  const { day: dayToComplete, hour: hourToComplete, minute: minutesToComplete } = useMemo(() => {
    let day = 0;
    let hour = 0;
    let minute = 0;

    let completionTime = project.timeToComplete;
    if (completionTime >= 1440) {
      day = Math.floor(completionTime / 1440);
      completionTime -= Math.floor(completionTime / 1440) * 1440;
    }
    if (completionTime >= 60) {
      hour = Math.floor(completionTime / 60);
      completionTime -= Math.floor(completionTime / 60) * 60;
    }
    if (completionTime < 60) minute = completionTime;

    return { day, hour, minute };
  }, [project.timeToComplete]);

  return (
    <Link to={`/builderpal/${project.chatId}/project/${project?.id}`} className="builderpal-project-item">
      <div className="builderpal-project-item-sub">
        <div className="builderpal-project-image">
          <MyImage alt="builderpal-project" src={project?.imageUri} defaultImage={difficultyLevels[project?.difficulty]?.defaultBackgroundImage} width={DEFAULT_CHALLENGE_IMAGE_SIZE} />
        </div>
        <div className="builderpal-project-details">
          <div className="name">
            <div className="text">
              {project?.title}
            </div>
          </div>
          <div className="desc">{project?.description}</div>
        </div>
        <div className="earned-builderpal-project-users">
          {project?.difficulty && (
          <div className="text description">
            <div className="difficulty">
              <div className="stars">
                {project?.difficulty && difficultyLevels[project.difficulty].stars.map((star, index) => (
                  <img key={`star-${index.toString()}`} alt="logo" src={star} />
                ))}
              </div>
              <div className="level">
                {project?.difficulty && difficultyLevels[project?.difficulty].label}
              </div>
            </div>
          </div>
          )}

          {project?.timeToComplete && (
            <div className="text description">
              <div className="difficulty">
                <div className="stars">
                  <img alt="logo" src={Clock} />
                </div>
                <div className="level">
                  {dayToComplete !== 0 && t('day', { count: dayToComplete })}
                  {hourToComplete !== 0 && t('hour', { count: hourToComplete })}
                  {minutesToComplete !== 0 && t('minute', { count: minutesToComplete })}
                </div>
              </div>
            </div>
          )}
        </div>
        {!hideSaveButton && (
          <span className={`like-button ${isUserSaved ? 'active' : ''}`} onClick={saveToggle}>
            <HeartSvg className={`${isUserSaved ? 'heart-button saved' : 'heart-button'}`} />
          </span>
        )}
      </div>
    </Link>
  );
}

export default BuilderPalProjectItem;
