import Colorful from '@uiw/react-color-colorful';
import React, { useEffect, useState } from 'react';
import Modal from 'src/components/common/modal/modal';
import { ReactComponent as CrossSVG } from '../../../../../css/imgs/icon-cross.svg';

// eslint-disable-next-line import/prefer-default-export
export function ColorModal({ showModal, setShowModal }) {
  const storedHex = localStorage.getItem('VIVIBOOM_CHAT_COLOR');
  const [hex, setHex] = useState(storedHex || '#7353ff');

  const onHexChange = (color) => {
    const newValue = color.hex;
    if (newValue.length && newValue.length === 7) {
      setHex(newValue);
      const root = document.getElementById('chat-root');
      root.style.setProperty('--primary-color', `${newValue}E6`);
      root.style.setProperty('--primary-color-alpha', `${newValue}1A`);
    }
  };

  useEffect(() => {
    if (!showModal) {
      localStorage.setItem('VIVIBOOM_CHAT_COLOR', hex);
    }
  }, [hex, showModal]);

  useEffect(() => {
    onHexChange({ hex: storedHex || '#7353ff' });
  }, [storedHex]);

  return (
    <Modal
      show={showModal}
      className="popup-color"
      handleClose={() => setShowModal(false)}
    >
      <div className="color-close-button" onClick={() => setShowModal(false)}>
        <CrossSVG className="color-close-button-icon icon-cross" />
      </div>
      <div className="color-picker-container">
        <Colorful color={hex} onChange={onHexChange} disableAlpha />
      </div>
    </Modal>
  );
}
