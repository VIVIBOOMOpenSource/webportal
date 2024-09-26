import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function AdminPanelFooter({ buttonText, onButtonClick }) {
  return (
    <div className="admin-panel__form-footer">
      <button onClick={onButtonClick}>{buttonText}</button>
    </div>
  );
}
