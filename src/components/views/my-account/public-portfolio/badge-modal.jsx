import React from 'react';
import { ReactComponent as CrossSVG } from '../../../../css/imgs/icon-cross.svg';
import DefaultCreatorPicture from '../../../../css/imgs/boom-imgs/project/default-creator-picture.png';
import './badge-modal.scss';

import Modal from '../../../common/modal/modal';

function BadgeModal({
  show,
  badge,
  handleClose,
}) {
  return (
    <Modal
      show={show}
      className="popup-badge"
      handleClose={() => {
        handleClose();
      }}
    >
      <div
        className="popup-close-button"
        onClick={() => {
          handleClose();
        }}
      >
        <CrossSVG className="popup-close-button-icon icon-cross" />
      </div>
      <div className="badge-details">
        <div className="badge-image">
          <img
            src={badge?.imageUri || DefaultCreatorPicture}
            alt="no img"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = DefaultCreatorPicture;
            }}
          />
        </div>
        <div className="badge-name">
          {badge?.name}
        </div>
        <div className="badge-description">
          {badge?.description}
        </div>
      </div>
    </Modal>
  );
}

export default BadgeModal;
