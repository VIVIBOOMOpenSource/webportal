import {
  React, useState, useEffect, useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import $ from 'jquery';
import MyImage from 'src/components/common/MyImage';

import 'src/js/vendor/wheelspin';
import 'src/js/vendor/jquery-ui.min';
import './badge-randomizer.scss';

import Preloader from 'src/components/common/preloader/preloader';
import ArrowSvg from 'src/css/imgs/wheelspin-imgs/arrow.svg';
import { ReactComponent as SlotMachine } from 'src/css/imgs/wheelspin-imgs/slot-machine.svg';
import DefaultBadgePicture from 'src/css/imgs/boom-imgs/badge/default-badge-picture.png';

const DEFAULT_BADGE_IMAGE_SIZE = 256;

function BadgeRandomizer({ badges }) {
  const { t } = useTranslation('translation', { keyPrefix: 'badges' });
  const [spinning, setSpinning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [badgeName, setBadgeName] = useState('');
  const [badgeId, setBadgeId] = useState(-1);
  const [badgeImg, setBadgeImg] = useState('');

  const badgeImageParams = useMemo(() => ({ suffix: 'png' }), []);

  const spinCallback = (data) => {
    const s = document.querySelector('#slot-machine-animation');
    if (s === undefined || s === null) return;

    const soundEffect = new Audio('https://res.cloudinary.com/viviboom/video/upload/production/slot-machine.mp3');
    const p = document.querySelector('#wheelSpinHolder .prizeList');

    switch (data.status) {
      case 'spinstart':
        // when spin start
        setSpinning(true);
        setShowResults(false);
        s.style.pointerEvents = 'none';

        soundEffect.volume = 0.5;
        soundEffect.play();
        break;

      case 'spinstop':
        setShowResults(true);

        if (!p) return;

        setBadgeImg(p.dataset.image);
        setBadgeName(p.dataset.name);
        setBadgeId(p.dataset.id);

        p.classList.add('pulsate-fwd');

        setTimeout(() => {
          p.classList.remove('pulsate-fwd');
          s.style.pointerEvents = 'auto';
        }, 1500);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (badges === undefined || badges.length === 0) return;

    $('#wheelSpinHolder').wheelSpinAnimation({
      width: 500,
      height: 250,
      callback: spinCallback,
    });

    const s = document.querySelector('#slot-machine-animation');
    s.addEventListener('click', () => {
      s.classList.add('slot-machine-g4_to');
      setTimeout(() => {
        s.classList.remove('slot-machine-g4_to');
      }, 800);
    });

    $('.buttonSpin').on('click', () => {
      $('#wheelSpinHolder').wheelSpinAnimation('spin');

      setTimeout(() => {
        $('#wheelSpinHolder').wheelSpinAnimation('stop');
      }, 1000);
    });
  }, [badges]);

  return (
    <div className="badge-randomizer">
      <div className="badge-randomizer-machine-container">
        <div className="badge-randomizer-machine">
          <SlotMachine />
          <div id="mainHolder" className="fitImg">
            <div id="wheelSpinHolder" className="wheelSpinHolder fitImg">
              <div className="wheelSpinList">
                <ul>
                  {badges.map((b, idx) => (
                    <li className="prizeList" data-prizenum={idx} data-id={b.id} data-name={b.name} data-image={b.imageUri} key={`random-badge_${b.id}`}>
                      {b?.isChallenge ? (
                        <Link to={`/challenge/${b.id}`}>
                          <MyImage src={b.imageUri} alt={b.name} defaultImage={DefaultBadgePicture} width={DEFAULT_BADGE_IMAGE_SIZE} params={badgeImageParams} />
                        </Link>
                      ) : (
                        <Link to={`/badge/${b.id}`}>
                          <MyImage src={b.imageUri} alt={b.name} defaultImage={DefaultBadgePicture} width={DEFAULT_BADGE_IMAGE_SIZE} params={badgeImageParams} />
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="wheelSpinBorder" />
              <div className="wheelSpinHighlightBackground" />
              <div className="wheelSpinHighlight" />
              <div className="wheelSpinSelect">
                <img alt="arrow" src={ArrowSvg} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="badge-randomizer-text-container">
        <div className="badge-randomizer-text">
          {spinning && showResults && (
            <div className="badge-randomizer-badge">
              <MyImage alt="winning-badge" src={badgeImg} defaultImage={DefaultBadgePicture} width={DEFAULT_BADGE_IMAGE_SIZE} />
              <h4>{badgeName}</h4>
              <div className="button-container">
                <Link className="button" to={`/badge/${badgeId}`}>
                  {t('View Badge')}
                </Link>
              </div>
            </div>
          )}
          {spinning && !showResults && (
            <div>
              <Preloader />
            </div>
          )}
          {!spinning && (
            <div>
              <h4>{t("Don't know what to do next?")}</h4>
              <h4>
                <Trans i18nKey="badges.clickHandle">
                  {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                  Click the <span style={{ color: 'red' }}>red</span> handle for a random badge!
                </Trans>
              </h4>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BadgeRandomizer;
