import React from 'react';
// eslint-disable-next-line import/prefer-default-export
export function TeamChannelPreview({ name, isUnread }) {
  return (
    <div className="channel-preview__item">
      <p className={isUnread ? 'unread' : ''}>{`# ${name}`}</p>
    </div>
  );
}
