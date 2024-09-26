import React, { useMemo, useState } from 'react';
import { ChannelList } from 'stream-chat-react';
import { ChannelSearch } from '../ChannelSearch/ChannelSearch';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { ChannelPreview } from '../ChannelPreview/ChannelPreview';

import Logo from './v-icon.png';
import { useChatContext } from '../../context/ChatContext';
import { ColorModal } from './ColorModal';

const filters = [
  { type: 'team' },
  { type: 'messaging' },
];
const options = {
  state: true, watch: true, presence: true,
};
const sort = { last_message_at: -1, updated_at: -1 };

function FakeCompanySelectionBar() {
  return (
    <div className="sidebar__company-selection-bar">
      <div className="sidebar__company-badge">
        <img src={Logo} alt="V" />
      </div>
    </div>
  );
}

const customChannelTeamFilter = (channels) => channels.filter((channel) => channel.type === 'team');

const customChannelMessagingFilter = (channels) => channels.filter((channel) => channel.type === 'messaging');

function TeamChannelsList({ chatClient }) {
  const chatClientUserId = chatClient?.user?.id;
  const memoizedFilters = useMemo(
    () => ({
      ...filters[0],
      members: {
        $in: [chatClientUserId],
      },
    }),
    [chatClientUserId],
  );

  return (
    <ChannelList
      channelRenderFilterFn={customChannelTeamFilter}
      filters={memoizedFilters}
      options={options}
      sort={sort}
      List={(listProps) => (
        <TeamChannelList
          {...listProps}
          type="team"
        />
      )}
      Preview={(previewProps) => (
        <ChannelPreview
          {...previewProps}
          type="team"
        />
      )}
    />
  );
}

function MessagingChannelsList({ chatClient }) {
  const chatClientUserId = chatClient?.user?.id;
  const memoizedFilters = useMemo(
    () => ({
      ...filters[1],
      members: {
        $in: [chatClientUserId],
      },
    }),
    [chatClientUserId],
  );

  return (
    <ChannelList
      channelRenderFilterFn={customChannelMessagingFilter}
      filters={memoizedFilters}
      options={options}
      sort={sort}
      setActiveChannelOnMount={false}
      List={(listProps) => (
        <TeamChannelList
          {...listProps}
          type="messaging"
        />
      )}
      Preview={(previewProps) => (
        <ChannelPreview
          {...previewProps}
          type="messaging"
        />
      )}
    />
  );
}

// eslint-disable-next-line import/prefer-default-export
export function Sidebar() {
  const { chatClient } = useChatContext();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="sidebar">
        <FakeCompanySelectionBar />
        <div className="channel-list-bar">
          <div className="channel-list-bar__header">
            <div className="channel-list-bar__header__text">Chat</div>
            <div className="color-button" onClick={() => setShowModal(true)}>
              <div className="color-text">COLOR</div>
              <div className="color-circle" />
            </div>
          </div>
          <ChannelSearch />
          <TeamChannelsList chatClient={chatClient} />
          <MessagingChannelsList chatClient={chatClient} />
        </div>
      </div>
      <ColorModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
