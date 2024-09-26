import React from 'react';
import { CloseThreadButton } from './CloseThreadButton';

// eslint-disable-next-line import/prefer-default-export
export function ThreadHeader(props) {
  const { closeThread, thread } = props;

  const getReplyCount = () => {
    if (!thread?.reply_count) return '';
    if (thread.reply_count === 1) return '1 reply';
    return `${thread.reply_count} replies`;
  };

  return (
    <div className="custom-thread-header">
      <div className="workspace-header__block">
        <div className="workspace-header__title">Thread</div>
        <div className="workspace-header__subtitle">{getReplyCount()}</div>
      </div>
      <CloseThreadButton onClick={closeThread} />
    </div>
  );
}
