import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChatContext } from 'stream-chat-react';
import _debounce from 'lodash.debounce';

import { channelByUser, isChannel } from './utils';
import { ResultsDropdown } from './ResultsDropdown';

import { SearchIcon } from '../../assets';

// eslint-disable-next-line import/prefer-default-export
export function ChannelSearch() {
  const { client, setActiveChannel } = useChatContext();
  const institutionId = useSelector((state) => state?.user?.institutionId);

  const [allChannels, setAllChannels] = useState();
  const [teamChannels, setTeamChannels] = useState();
  const [directChannels, setDirectChannels] = useState();

  const [focused, setFocused] = useState();
  const [focusedId, setFocusedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'ArrowDown') {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === allChannels.length - 1 ? 0 : prevFocused + 1;
        });
      } else if (event.key === 'ArrowUp') {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === 0 ? allChannels.length - 1 : prevFocused - 1;
        });
      } else if (event.key === 'Enter') {
        event.preventDefault();

        if (allChannels !== undefined && focused !== undefined) {
          const channelToCheck = allChannels[focused];

          if (isChannel(channelToCheck)) {
            setActiveChannel(channelToCheck);
          } else {
            channelByUser({
              client,
              setActiveChannel,
              user: channelToCheck,
              team: institutionId > 1 ? String(institutionId) : undefined,
            });
          }
        }

        setFocused(undefined);
        setFocusedId('');
        setQuery('');
      }
    },
    [allChannels, client, focused, setActiveChannel], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (query) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, query]);

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  useEffect(() => {
    if (focused && focused >= 0 && allChannels) {
      setFocusedId(allChannels[focused].id || '');
    }
  }, [allChannels, focused]);

  const setChannel = (
    channel,
  ) => {
    setQuery('');
    setActiveChannel(channel);
  };

  const getChannels = async (text) => {
    try {
      const channelResponse = client.queryChannels(
        {
          type: 'team',
          name: { $autocomplete: text },
          members: { $in: [client.userID] },
        },
        {},
        { limit: 5 },
      );

      const userResponse = client.queryUsers(
        {
          id: { $ne: client.userID || '' },
          $and: [
            { name: { $autocomplete: text } },
          ],
        },
        { name: 1 },
        { limit: 5 },
      );

      const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
      setAllChannels([...channels, ...users]);
    } catch (event) {
      setQuery('');
    }

    setLoading(false);
  };

  const getChannelsDebounce = _debounce(getChannels, 100, {
    trailing: true,
  });

  const onSearch = (event) => {
    event.preventDefault();

    setLoading(true);
    setFocused(undefined);
    setQuery(event.target.value);
    if (!event.target.value) return;

    getChannelsDebounce(event.target.value);
  };

  return (
    <div className="channel-search__container">
      <div className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          onChange={onSearch}
          placeholder="Search"
          type="text"
          value={query}
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          focusedId={focusedId}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
        />
      )}
    </div>
  );
}
