import React, {
  useState, useEffect,
} from 'react';

import { Player } from '@lottiefiles/react-lottie-player';

import Modal from 'src/components/common/modal/modal';
import HappyBirthday from './happy-birthday.json';
import PopperRight from './popper-right.json';
import Gift from './gift.json';
import Card from './pokemon-card.png';
import RachelLeft from './rachel-left.png';
import RachelRight from './rachel-right.png';
import RachelBottom from './rachel-bottom.png';
import Text from './text.png';
import Pikachu from './pikachu.gif';
import Piano from './piano.gif';
import Vivivault from './vivivault.png';
import './HappyBirthdayToYou.scss';

/**
 * @returns the happy birthday wishes for our brilliant coder - Rachel Tan. Wish your day to be filled with rare Pokémons and epic batles! Keep evolving and catching your dreams!!
 */

function HappyBirthdayRachel() {
  const [showCard, setShowCard] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [audio] = useState(new Audio('https://res.cloudinary.com/viviboom/video/upload/v1712610963/production/8sdjed_i6dwkz.mp3'));

  useEffect(
    () => {
      if (showContent) {
        audio.loop = true;
        audio.play();
      }
    },
    [showContent],
  );

  return (
    <div className="happy-birthday-rachel">
      <Player
        autoplay
        loop
        src={HappyBirthday}
        className={`happy-birthday-anim${showContent ? '' : ' hide-top'}`}
      />
      <div className={showContent ? 'popper-right-anim-container' : 'popper-right-anim-container hide-right'}>
        <Player
          autoplay
          loop
          src={PopperRight}
          className="popper-right-anim"
        />
      </div>
      <div className="gift-anim-container" onClick={() => setShowModal(true)}>
        <Player
          autoplay
          loop
          src={Gift}
          className={`gift-anim${showContent ? '' : ' hide-left'}`}
        />
      </div>
      {!showContent && <img src={Card} alt="pokemon-card" className={showCard ? 'pokemon-card' : 'pokemon-card hide-card'} onClick={() => { setShowCard(false); setTimeout(() => setShowContent(true), 1200); }} />}
      <div className={showContent ? 'rachel-left-container' : 'rachel-left-container hide-left'}>
        <img src={RachelLeft} alt="rachel-left" className="rachel-left" />
      </div>
      <div className={showContent ? 'rachel-right-container' : 'rachel-right-container hide-right'}>
        <img src={RachelRight} alt="rachel-right" className="rachel-right" />
      </div>
      <div className={showContent ? 'rachel-bottom-container' : 'rachel-bottom-container hide-bottom'}>
        <img src={RachelBottom} alt="rachel-bottom" className="rachel-bottom" />
      </div>
      <div className={showContent ? 'pikachu-bottom-container' : 'pikachu-bottom-container hide-bottom'}>
        <img src={Pikachu} alt="pikachu" className="pikachu-bottom" />
      </div>
      <div className={showContent ? 'text-left-container' : 'text-left-container hide-left'}>
        <img src={Text} alt="text-left" className="text-left" />
      </div>
      <div className={showContent ? 'piano-right-container' : 'piano-right-container hide-right'}>
        <img src={Piano} alt="piano-right" className="piano-right" onClick={() => audio.pause()} />
      </div>
      <Modal show={showModal} className="popup-modal" handleClose={() => setShowModal(false)}>
        <img src={Vivivault} alt="vivivault" className="vivivault" />
      </Modal>
    </div>
  );
}

export default HappyBirthdayRachel;
