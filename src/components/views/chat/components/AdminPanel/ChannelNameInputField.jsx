import React from 'react';
import { ValidationError } from './ValidationError';

// eslint-disable-next-line import/prefer-default-export
export function ChannelNameInputField({
  name = '', error, placeholder = 'channel-name', onChange,
}) {
  return (
    <div className="channel-name-input-field">
      <h2>
        <span>Name</span>
        <ValidationError errorMessage={error} />
      </h2>
      <input onChange={onChange} placeholder={placeholder} type="text" value={name} />
    </div>
  );
}
