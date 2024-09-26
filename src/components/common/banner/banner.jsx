import React from 'react';
import './banner.scss';

function Banner({ classAddOn, title, titleSub }) {
  return (
    <div className={`banner ${(classAddOn) || ''}`}>
      <div className="background" />
      <div className="overlay-image" />
      <div className="text">
        <div className="title">{title}</div>
        <div className="title-sub">{titleSub}</div>
      </div>
    </div>
  );
}

export default Banner;
