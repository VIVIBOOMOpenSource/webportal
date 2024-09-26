import React from 'react';
import { CloseAdminPanelButton } from './CloseAdminPanelButton';

// eslint-disable-next-line import/prefer-default-export
export function AdminPanelHeader({ onClose, title }) {
  return (
    <div className="admin-panel__form-header">
      <div className="workspace-header__title workspace-header__block">{title}</div>
      <CloseAdminPanelButton onClick={onClose} />
    </div>
  );
}
