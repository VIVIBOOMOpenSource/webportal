/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/react-in-jsx-scope */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useChatContext } from 'stream-chat-react';

const Context = createContext({
  handleInputChange: () => null,
  handleMemberSelect: () => null,
  handleSubmit: () => null,
  members: [],
  name: '',
  errors: { name: null, members: null },
  action: '',
});

const getChannelTypeFromWorkspaceName = (workspace) => (
  workspace.match(/.*__(team|messaging)/)?.[1]
);

const getUpsertAction = (workspace) => {
  if (workspace.match('Channel-Create')) return 'create';
  if (workspace.match('Channel-Edit')) return 'update';
};

export function AdminPanelForm({
  children, defaultValues, workspace, onSubmit,
}) {
  const { client, channel, setActiveChannel } = useChatContext();
  const institutionId = useSelector((state) => state?.user?.institutionId);
  const [channelName, setChannelName] = useState(defaultValues.name);
  const [allMembers, setMembers] = useState(defaultValues.members);
  const [_errors, setErrors] = useState({ name: null, members: null });

  // eslint-disable-next-line no-underscore-dangle
  const _createChannelType = getChannelTypeFromWorkspaceName(workspace);
  // eslint-disable-next-line no-underscore-dangle
  const _action = getUpsertAction(workspace);

  const createChannel = useCallback(async ({ name, members }) => {
    if (!_createChannelType || members.length === 0) return;

    const newChannel = await client.channel(_createChannelType, name, {
      name,
      members,
      team: institutionId > 1 ? String(institutionId) : undefined,
      demo: 'team',
    });

    await newChannel.watch();

    setActiveChannel(newChannel);
  }, [_createChannelType, client, institutionId, setActiveChannel]);

  const updateChannel = useCallback(async ({ name, members }) => {
    if (name !== (channel?.data?.name || channel?.data?.id)) {
      await channel?.update(
        { name },
        { text: `Channel name changed to ${name}` },
      );
    }

    if (members?.length) {
      await channel?.addMembers(members);
    }
  }, [channel]);

  const validateForm = useCallback(({ action, createChannelType, values }) => {
    let errors = { name: null, members: null };

    if (action === 'create') {
      errors = {
        name: !values.name && createChannelType === 'team' ? 'Channel name is required' : null,
        members: values.members.length < 2 ? 'At least one additional member is required' : null,
      };
    }

    if (action === 'update' && values.name === defaultValues.name && values.members.length === 0) {
      errors = {
        name: 'Name not changed (change name or add members)',
        members: 'No new members added (change name or add members)',
      };
    }

    return Object.values(errors).some((v) => !!v) ? errors : null;
  }, [defaultValues.name]);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    const errors = validateForm({ values: { name: channelName, members: allMembers }, action: _action, createChannelType: _createChannelType });

    if (errors) {
      setErrors(errors);
      return;
    }

    try {
      if (_action === 'create') await createChannel({ name: channelName, members: allMembers });
      if (_action === 'update') await updateChannel({ name: channelName, members: allMembers });
      onSubmit();
    } catch (err) {
      console.error(err);
    }
  }, [_action, _createChannelType, channelName, allMembers, createChannel, updateChannel, onSubmit, validateForm]);

  const handleInputChange = useCallback((event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  }, []);

  const handleMemberSelect = useCallback((event) => {
    setMembers((prevMembers) => {
      const { value } = event.target;
      if (event.target.checked) {
        return prevMembers.length ? [...prevMembers, value] : [value];
      }
      return prevMembers?.filter((prevUser) => prevUser !== value);
    });
  }, []);

  useEffect(() => {
    setChannelName(defaultValues.name);
    setMembers(defaultValues.members);
  }, [defaultValues, _createChannelType]);

  return (
    <Context.Provider value={{
      action: _action,
      createChannelType: _createChannelType,
      errors: _errors,
      name: channelName,
      members: allMembers,
      handleInputChange,
      handleMemberSelect,
      handleSubmit,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export const useAdminPanelFormState = () => useContext(Context);
