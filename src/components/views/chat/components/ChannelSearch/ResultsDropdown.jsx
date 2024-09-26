import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, useChatContext } from 'stream-chat-react';

import { channelByUser, isChannel } from './utils';

function SearchResult(props) {
  const institutionId = useSelector((state) => state?.user?.institutionId);
  const { focusedId, result, setChannel } = props;

  const { client, setActiveChannel } = useChatContext();

  if (isChannel(result)) {
    const channel = result;

    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        onClick={() => setChannel(channel)}
        className={`channel-search__result-container ${focusedId === channel.id ? 'highlighted' : ''}`}
      >
        <div className="result-hashtag">#</div>
        <p className="channel-search__result-text">{channel?.data?.name}</p>
      </div>
    );
  }
  const user = result;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={() => {
        channelByUser({
          client, setActiveChannel, user, team: institutionId > 1 ? String(institutionId) : undefined,
        });
      }}
      className={`channel-search__result-container ${focusedId === user.id ? 'highlighted' : ''}`}
    >
      <Avatar image={user.image} name={user.name || user.id} size={24} />
      <p className="channel-search__result-text">{user.name || user.id || 'Johnny Blaze'}</p>
    </div>
  );
}

// eslint-disable-next-line import/prefer-default-export
export function ResultsDropdown(props) {
  const {
    teamChannels, directChannels, focusedId, loading, setChannel, setQuery,
  } = props;
  document.addEventListener('click', () => setQuery(''));

  return (
    <div className="channel-search__results">
      <p className="channel-search__results-header">Channels</p>
      {loading && !teamChannels?.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !teamChannels?.length ? (
        <p className="channel-search__results-header">
          <i>No channels found</i>
        </p>
      ) : (
        teamChannels?.map((channel, i) => (
          <SearchResult result={channel} focusedId={focusedId} key={i} setChannel={setChannel} />
        ))
      )}
      <p className="channel-search__results-header">Users</p>
      {loading && !directChannels?.length && (
        <p className="channel-search__results-header">
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels?.length ? (
        <p className="channel-search__results-header">
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels?.map((user, i) => (
          <SearchResult result={user} focusedId={focusedId} key={i} setChannel={setChannel} />
        ))
      )}
    </div>
  );
}
