import React from 'react';
import { useHistory } from 'react-router-dom';
import './public-member-item.scss';

import DefaultProfilePicture from 'src/css/imgs/boom-imgs/profile/default-profile-picture.png';
import { getCountryFlag } from 'src/utils/countries';

function PublicMemberItem({ member }) {
  const history = useHistory();
  return (
    <div className="public-member-item" onClick={() => history.push(`/view-portfolio/${member?.id}`)}>
      <div className="member-profile-container">
        <img
          src={member.profileImageUri || DefaultProfilePicture}
          alt="profile"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = DefaultProfilePicture;
          }}
        />
        <div className="country-flag">
          <img alt="country" src={getCountryFlag(member.branch.countryISO)} />
        </div>
      </div>
      <div className="name-description">
        <p className="name">{member.name}</p>
        <p className="description">{member.description || "This mysterious Vivinaut didn't write anything..."}</p>
      </div>
    </div>
  );
}

export default PublicMemberItem;
