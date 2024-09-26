import React, {
  useCallback, useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import './challenge-details.scss';

import { EditorState, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import EmbeddedYoutubeLinkManipulator from 'src/js/editor/embeddedYoutubeLinkManipulator';

import DefaultChallengePicture from 'src/css/imgs/boom-imgs/badge/default-badge-picture.png';
import Categories from 'src/css/imgs/icon-categories.png';
import Star from 'src/css/imgs/icon-star.png';
import StarOutline from 'src/css/imgs/icon-star-outline.png';
import Clock from 'src/css/imgs/icon-clock.png';
import Steps from 'src/css/imgs/icon-steps.png';
import About from 'src/css/imgs/icon-about.png';
import BackgroundImage from 'src/css/imgs/badges-bg.jpg';
import PublicChallengeApi from 'src/apis/viviboom/PublicChallengeApi';
import BadgeModal from 'src/components/views/my-account/public-portfolio/badge-modal';

const DEFAULT_CHALLENGE_IMAGE_SIZE = 256;
const DEFAULT_COVER_IMAGE_SIZE = 1024;

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

function PublicChallengeDetails() {
  const { t } = useTranslation('translation', { keyPrefix: 'challenges' });
  const params = useParams();
  const { challengeId, portfolioCode } = params;

  const [loading, setLoading] = useState(false);

  const [challenge, setChallenge] = useState(undefined);
  const [challengeBadge, setChallengeBadge] = useState(null);
  const [dayToComplete, setDayToComplete] = useState(0);
  const [hourToComplete, setHourToComplete] = useState(0);
  const [minutesToComplete, setMinutesToComplete] = useState(0);

  const [editorStateForSteps, setEditorStateForSteps] = useState(EditorState.createEmpty());

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

  const fetchChallenge = useCallback(async () => {
    const requestParams = {
      challengeId,
      portfolioCode,
      verboseAttributes: ['categories'],
    };
    setLoading(true);
    try {
      const res = await PublicChallengeApi.get(requestParams);
      setChallenge(res.data?.challenge);

      const fetchedChallenge = res.data?.challenge;
      calculateDayHourMin(fetchedChallenge?.timeToComplete);
      if (fetchedChallenge.content) setEditorStateForSteps(EditorState.createWithContent(convertFromRaw(JSON.parse(fetchedChallenge.content))));
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
    setLoading(false);
  }, [challengeId, portfolioCode]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  return (
    <div className={window.isRNWebView ? 'challenge-page hide-in-app' : 'challenge-page'}>
      <div className="challenge-header-container">
        <div className="cover-image">
          <img
            src={challenge?.coverImageUri || BackgroundImage}
            width={DEFAULT_COVER_IMAGE_SIZE}
            alt="challenge"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = BackgroundImage;
            }}
          />
        </div>
        <div className="challenge-details-public">
          <div className="basic-challenge-info">
            <div className="challenge-image-container">
              <img
                src={challenge?.imageUri || DefaultChallengePicture}
                width={DEFAULT_CHALLENGE_IMAGE_SIZE}
                alt="challenge"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = DefaultChallengePicture;
                }}
              />
            </div>
            <div className="text">
              <div className="name">{challenge?.name}</div>
            </div>
          </div>
          <div className="challenge-specs-container">
            {challenge?.difficulty && (
              <div className="challenge-spec">
                <div className="spec-icon">
                  {challenge?.difficulty && difficultyLevels[challenge.difficulty].stars.map((star, index) => (
                    <img key={`star-${index.toString()}`} alt="logo" src={star} />
                  ))}
                </div>
                <div className="spec-text">
                  {challenge?.difficulty && difficultyLevels[challenge?.difficulty].label}
                </div>
              </div>
            )}
            {challenge?.timeToComplete && (
            <div className="challenge-spec">
              <div className="spec-icon">
                <img alt="logo" src={Clock} />
              </div>
              <div className="spec-text">
                {dayToComplete !== 0 && t('day', { count: dayToComplete })}
                {hourToComplete !== 0 && t('hour', { count: hourToComplete })}
                {minutesToComplete !== 0 && t('minute', { count: minutesToComplete })}
              </div>
            </div>
            )}
            {challenge?.categories[0]?.name && (
              <div className="challenge-spec">
                <div className="spec-icon">
                  <img alt="logo" src={Categories} />
                </div>
                <div className="spec-text">
                  {challenge?.categories[0]?.name}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="public-challenge-participation-stats">
        <div className="separator-container" />
      </div>

      <div className="body">
        <div className="challenge-info">
          <div className="challenge-info-container">
            {challenge?.description && (
            <div className="challenge-container">
              <div className="icon-size">
                <img alt="logo" src={About} />
              </div>
              <div>
                <div className="title">{t('About this challenge')}</div>
                <div className="name">{challenge?.description}</div>
              </div>
            </div>
            )}
            {challenge?.content && (
            <div className="how-to-earn-challenge">
              <div className="icon-size">
                <img alt="logo" src={Steps} />
              </div>
              <div>
                <div className="title">{t('Steps to earn this challenge')}</div>
                <div>
                  <Editor
                    editorState={editorStateForSteps}
                    toolbarClassName="toolbar"
                    wrapperClassName="wrapper"
                    editorClassName="editor"
                    toolbarHidden
                    readOnly
                    toolbar={{
                      embedded: {
                        embedCallback: EmbeddedYoutubeLinkManipulator,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
      <BadgeModal show={!!challengeBadge} badge={challengeBadge} handleClose={() => setChallengeBadge(null)} />
    </div>
  );
}

export default PublicChallengeDetails;
