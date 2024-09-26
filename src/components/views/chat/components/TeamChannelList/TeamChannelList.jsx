import React, { useCallback } from 'react';

import { AddChannelButton } from './AddChannelButton';

import { useWorkspaceController } from '../../context/WorkspaceController';

function ChannelList(props) {
  const {
    children,
    error = false,
    loading,
    type,
  } = props;

  const { displayWorkspace } = useWorkspaceController();

  const handleAddChannelClick = useCallback(() => {
    displayWorkspace(`Admin-Admin-Channel-Create__${type}`);
  }, [type, displayWorkspace]);

  if (error) {
    return type === 'team' ? (
      <div className="team-channel-list">
        <p className="team-channel-list__message">
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className="team-channel-list">
        <p className="team-channel-list__message loading">
          {type === 'team' ? 'Channels' : 'Messages'}
          {' '}
          loading....
        </p>
      </div>
    );
  }

  return (
    <div className="team-channel-list">
      <div className="team-channel-list__header">
        <p className="team-channel-list__header__title">
          {type === 'team' ? 'Channels' : 'Direct Messages'}
        </p>
        <AddChannelButton onClick={handleAddChannelClick} />
      </div>
      {children}
    </div>
  );
}

// eslint-disable-next-line import/prefer-default-export
export const TeamChannelList = React.memo(ChannelList);
