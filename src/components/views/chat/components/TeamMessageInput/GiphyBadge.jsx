import React from 'react';
import { LightningBoltIcon } from './LightningBoltIcon';

// eslint-disable-next-line import/prefer-default-export
export function GiphyBadge() {
  return (
    <div className="giphy-icon__wrapper">
      <LightningBoltIcon />
      <p className="giphy-icon__text">GIPHY</p>
    </div>
  );
}
