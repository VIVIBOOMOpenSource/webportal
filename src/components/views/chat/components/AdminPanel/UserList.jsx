import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import _debounce from 'lodash.debounce';

import { DateTime } from 'luxon';
import { useAdminPanelFormState } from './context/AdminPanelFormContext';
import { ValidationError } from './ValidationError';
import { SearchIcon } from '../../assets';

function ListContainer(props) {
  const { children, query, setQuery } = props;
  const { errors, createChannelType } = useAdminPanelFormState();

  const onSearch = (event) => {
    event.preventDefault();

    setQuery(event.target.value);
  };

  return (
    <div className="user-list__container">
      <div className="user-list__header-title">
        <div className="user-list__header-title-left">
          <span>{createChannelType === 'team' ? 'Add Members' : 'Members'}</span>
          <ValidationError errorMessage={errors.members} />
        </div>
        <div className="user-list__input">
          <div className="user-list__input__wrapper">
            <div className="user-list__input__icon">
              <SearchIcon color="#aaa" />
            </div>
            <input
              onChange={onSearch}
              placeholder="Search"
              type="text"
              value={query}
            />
          </div>
        </div>
      </div>
      <div className="user-list__header user-list__row">
        <div className="user-list__column-block">
          <p>User</p>
          <p className="user-list__column--last-active">Last Active</p>
        </div>
        <div className="user-list__column--checkbox">
          <p>Invite</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function UserItem({ user }) {
  const { handleMemberSelect } = useAdminPanelFormState();

  const lastActive = user.last_active ? DateTime.fromISO(user.last_active).toRelative() : '';
  const title = user.name || user.id;

  return (
    <label htmlFor={user.id} title={title} className="user-list__row">
      <div className="user-list__column-block">
        <div className="user-list__column--user-data">
          <Avatar image={user.image} name={title} size={32} />
          <p className="user-item__name">{title}</p>
        </div>
        <p className="user-list__column--last-active">{lastActive}</p>
      </div>
      <div className="user-list__column--checkbox">
        <input type="checkbox" name="members" id={user.id} value={user.id} onChange={handleMemberSelect} />
      </div>
    </label>
  );
}

const LOAD_STATE_NOTIFICATION = {
  empty: 'No users found.',
  error: 'Error loading, please refresh and try again.',
  loading: 'Loading users...',
};

// eslint-disable-next-line import/prefer-default-export
export function UserList() {
  const { client, channel } = useChatContext();
  const { action } = useAdminPanelFormState();
  const [loadState, setLoadState] = useState(null);
  const [users, setUsers] = useState();
  const [query, setQuery] = useState('');

  const channelMembers = useMemo(
    () => (channel?.state.members
      ? Object.keys(channel.state.members)
      : []),
    [channel?.state?.members],
  );

  const getUsers = useCallback(async () => {
    if (loadState) return;
    setLoadState('loading');

    try {
      const response = await client.queryUsers(
        {
          id: { $nin: action === 'create' ? [client.userID] : channelMembers },
          ...!!query && { name: { $autocomplete: query } },
        },
        { name: 1 },
      );

      if (response.users.length) {
        setUsers(response.users);
      } else {
        setLoadState('empty');
      }
    } catch (event) {
      setLoadState('error');
    }

    setLoadState(null);
  }, [action, channelMembers, client, loadState, query]);

  const getUsersDebounce = _debounce(getUsers, 100, {
    trailing: true,
  });

  useEffect(() => {
    if (client) getUsersDebounce();
  }, [client, query, channelMembers]);

  return (
    <ListContainer query={query} setQuery={setQuery}>
      {loadState
        ? <div className="user-list__message">{LOAD_STATE_NOTIFICATION[loadState]}</div>
        : users?.length && users.map((user, i) => <UserItem index={i} key={user.id} user={user} />)}
    </ListContainer>
  );
}
