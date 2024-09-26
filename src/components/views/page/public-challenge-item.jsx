import React from 'react';
import './public-challenge-item.scss';
import { Link } from 'react-router-dom';

import DefaultChallengePicture from 'src/css/imgs/boom-imgs/badge/default-badge-picture.png';

function PublicChallengeItem({ preloadedData, link }) {
  const challenge = preloadedData;

  return (
    <div className="public-challenge-item">
      <Link to={link} className="link">
        <div className="challenge-image">
          <img
            src={challenge?.imageUri || DefaultChallengePicture}
            alt="challenge"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = DefaultChallengePicture;
            }}
          />
        </div>
        <div className="challenge-details">
          <div className="name">
            <div className="text">
              {challenge?.name}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PublicChallengeItem;
