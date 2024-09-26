import './home-default.scss';
import 'react-multi-carousel/lib/styles.css';

import React from 'react';
import { isMobile } from 'react-device-detect';
import { BuilderComponent } from '@builder.io/react';
import Config from 'src/config';
import EnvironmentEnum from 'src/enums/environment';
import { useSelector } from 'react-redux';
import EventsAndWorkshopsSection from './common/eventsAndWorkshopSection';
import BuilderPalSection from './common/builderPalSection';

function HomeDefault({ workshops }) {
  const user = useSelector((state) => state?.user);
  return (
    <div>
      {user?.branch?.allowEventBooking && (<EventsAndWorkshopsSection workshops={workshops} />)}
      {user?.institution?.isBuilderPalEnabled && (<BuilderPalSection />)}
      {!isMobile && Config.Env === EnvironmentEnum.Production && user?.institutionId === 1 && <BuilderComponent model="sg-live-home-2" />}
      {!isMobile && Config.Env !== EnvironmentEnum.Production && user?.institutionId === 1 && <BuilderComponent model="sg-release-home-2" />}
    </div>
  );
}

export default HomeDefault;
