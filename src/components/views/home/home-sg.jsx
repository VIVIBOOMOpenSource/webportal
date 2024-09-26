import React from 'react';
import { isMobile } from 'react-device-detect';
import 'react-multi-carousel/lib/styles.css';
import { BuilderComponent } from '@builder.io/react';

import Config from 'src/config';
import EnvironmentEnum from 'src/enums/environment';
import { useSelector } from 'react-redux';
import './home-sg.scss';
import EventsAndWorkshopsSection from './common/eventsAndWorkshopSection';
import BuilderPalSection from './common/builderPalSection';

function HomeSg({ workshops }) {
  const user = useSelector((state) => state?.user);
  return (
    <div>
      {Config.Env === EnvironmentEnum.Production && <BuilderComponent model="sg-live-home-1" />}
      {user?.branch?.allowEventBooking && (<EventsAndWorkshopsSection workshops={workshops} />)}
      {user?.institution?.isBuilderPalEnabled && (<BuilderPalSection />)}
      {!isMobile && Config.Env === EnvironmentEnum.Production && <BuilderComponent model="sg-live-home-2" />}
      {!isMobile && Config.Env !== EnvironmentEnum.Production && <BuilderComponent model="sg-release-home-2" />}
    </div>
  );
}

export default HomeSg;
