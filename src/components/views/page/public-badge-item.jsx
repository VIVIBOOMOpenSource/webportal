import React from 'react';
import './public-badge-item.scss';

import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';

function PublicBadgeItem({ preloadedData, onClick }) {
  const badge = preloadedData;

  return (
    <div className="public-badge-item" onClick={onClick}>
      <div className="badge-image">
        <img
          src={badge?.imageUri || DefaultProfilePicture}
          alt="badge"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = DefaultProfilePicture;
          }}
        />
      </div>
      <div className="badge-details">
        <div className="name">
          <div className="text">
            {badge?.name}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicBadgeItem;
