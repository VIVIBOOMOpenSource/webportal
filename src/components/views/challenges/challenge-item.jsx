import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import MyImage from 'src/components/common/MyImage';
import './challenge-item.scss';

import ChallengeApi from 'src/apis/viviboom/ChallengeApi';
import Loading from 'src/components/common/loading/loading';

import DefaultChallengePicture from 'src/css/imgs/boom-imgs/badge/default-badge-picture.png';
import ChallengeCompletedIcon from 'src/css/imgs/boom-imgs/quest/completedq-s.png';
import Star from '../../../css/imgs/icon-star.png';
import StarOutline from '../../../css/imgs/icon-star-outline.png';
import Clock from '../../../css/imgs/icon-clock.png';

const DEFAULT_CHALLENGE_IMAGE_SIZE = 512;

const difficultyLevels = {
  BEGINNER: {
    stars: [Star, StarOutline, StarOutline],
    label: 'Beginner',
  },
  INTERMEDIATE: {
    stars: [Star, Star, StarOutline],
    label: 'Intermediate',
  },
  ADVANCED: {
    stars: [Star, Star, Star],
    label: 'Advanced',
  },
};

function ChallengeItem({
  id,
  preloadedData,
  disableLink,
  hideDescription,
  imageOnly,
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'challenges' });
  const user = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);

  const [challenge, setChallenge] = useState(preloadedData);
  const [dayToComplete, setDayToComplete] = useState(0);
  const [hourToComplete, setHourToComplete] = useState(0);
  const [minutesToComplete, setMinutesToComplete] = useState(0);

  const challengeImageParams = useMemo(() => ({ suffix: 'png' }), []);

  const calculateDayHourMin = (timeInMinutes) => {
    let completionTime = timeInMinutes;
    if (completionTime >= 1440) {
      setDayToComplete(Math.floor(completionTime / 1440));
      completionTime -= Math.floor(completionTime / 1440) * 1440;
    }
    if (completionTime >= 60) {
      setHourToComplete(Math.floor(completionTime / 60));
      completionTime -= Math.floor(completionTime / 60) * 60;
    }
    if (completionTime < 60) setMinutesToComplete(completionTime);
  };

  // API calls
  const fetchChallenge = useCallback(async () => {
    if (!user.authToken) return;
    if (challenge?.awardedUsers !== undefined || !id) return;
    if (imageOnly && challenge?.imageUri) return;
    setLoading(true);
    try {
      const res = await ChallengeApi.get({ authToken: user.authToken, challengeId: id });
      setChallenge(res.data?.challenge);
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [user?.authToken, challenge?.awardedUsers, challenge?.imageUri, id, imageOnly]);

  useEffect(() => {
    fetchChallenge();
    calculateDayHourMin(challenge?.timeToComplete);
  }, [fetchChallenge]);

  if (imageOnly) {
    return (
      <Link to={`/challenge/${id}`}>
        <MyImage alt="challenge" src={challenge.imageUri} defaultImage={DefaultChallengePicture} width={DEFAULT_CHALLENGE_IMAGE_SIZE} isLoading={loading} params={challengeImageParams} />
      </Link>
    );
  }

  const awardedUsers = challenge?.awardedUsers || [];
  const isAwarded = awardedUsers?.find((u) => u.id === user.id);

  const challengeItemSub = (
    <div className="challenge-item-sub">
      <div className="challenge-checkmark">&#10004;</div>
      {hideDescription && isAwarded && (
        <div className="challenge-earned">
          <img src={ChallengeCompletedIcon} alt="challenge earned!" />
        </div>
      )}
      <div className="challenge-image">
        <MyImage alt="challenge" src={challenge?.imageUri} defaultImage={DefaultChallengePicture} width={DEFAULT_CHALLENGE_IMAGE_SIZE} isLoading={loading} params={challengeImageParams} />
      </div>
      <div className="challenge-details">
        <div className="name">
          <div className="text">
            {challenge?.name}
          </div>
        </div>
        <div className="desc">{challenge?.description}</div>
      </div>
      <div className="earned-challenge-users">
        <Loading show={loading} size="24px" />
        {challenge?.difficulty && (
        <div className="text description">
          <div className="difficulty">
            <div className="stars">
              {challenge?.difficulty && difficultyLevels[challenge.difficulty].stars.map((star, index) => (
                <img key={`star-${index.toString()}`} alt="logo" src={star} />
              ))}
            </div>
            <div className="level">
              {challenge?.difficulty && difficultyLevels[challenge?.difficulty].label}
            </div>
          </div>
        </div>
        )}

        {challenge?.timeToComplete && (
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
    </div>
  );

  return disableLink ? (
    <div className="challenge-item">{challengeItemSub}</div>
  ) : (
    <Link to={`/challenge/${id}`} className="challenge-item">{challengeItemSub}</Link>
  );
}

export default ChallengeItem;
