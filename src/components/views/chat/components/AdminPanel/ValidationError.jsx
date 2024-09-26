import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export function ValidationError({ errorMessage = '' }) {
  return <div className="admin-panel__form-validation-error">{errorMessage}</div>;
}
