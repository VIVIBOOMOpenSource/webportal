import { PinIcon } from '../../assets';

// eslint-disable-next-line import/prefer-default-export
export function PinIndicator({ message }) {
  if (!message) return null;

  return (
    <div className="str-chat__message-team-pin-indicator">
      <PinIcon />
      {message.pinned_by
        ? `Pinned by ${message.pinned_by?.name || message.pinned_by?.id}`
        : 'Message pinned'}
    </div>
  );
}
