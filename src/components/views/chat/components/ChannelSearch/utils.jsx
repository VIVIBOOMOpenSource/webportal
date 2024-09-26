export const isChannel = (
  channel,
) => (channel).cid !== undefined;

export const channelByUser = async (props) => {
  const {
    client, setActiveChannel, user, team,
  } = props;

  const filters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [user.id, client.userID || ''] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) {
    return setActiveChannel(existingChannel);
  }

  const newChannel = client.channel('messaging', {
    members: [user.id, client.userID || ''],
    team,
  });
  return setActiveChannel(newChannel);
};
