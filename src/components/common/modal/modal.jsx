import React, { useEffect, useCallback } from 'react';
import './modal.scss';
import CenterDiv from '../center-div/center-div';
import { ReactComponent as CloseSVG } from '../../../css/imgs/icon-close.svg';

const Modal = ({
  className, handleClose, show, children,
}) => {
  const showHideClassname = show ? ' show-modal' : ' hide-modal';

  const keydownListenerCallback = useCallback((e) => {
    if (e.keyCode === 27) { // esc
      handleClose();
    }
  }, [handleClose]);

  useEffect(() => {
    document.addEventListener('keydown', keydownListenerCallback, false);
    return () => {
      document.removeEventListener('keydown', keydownListenerCallback, false);
    };
  }, [keydownListenerCallback]);

  const render = () => (
    <div className={`modal${showHideClassname}`}>
      <div onClick={handleClose} className="modal-gray-screen" />
      <CenterDiv>
        <div className={`modal-main ${className}`}>
          <div onClick={handleClose} className="modal-close-button">
            <CloseSVG />
          </div>
          {children}
        </div>
      </CenterDiv>
    </div>
  );

  return render();
};

export default Modal;
