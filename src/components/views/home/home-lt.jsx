import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import { BuilderComponent } from '@builder.io/react';

import Config from 'src/config';
import EnvironmentEnum from 'src/enums/environment';
import { useSelector } from 'react-redux';
import './home-lt.scss';
import EventsAndWorkshopsSection from './common/eventsAndWorkshopSection';
import BuilderPalSection from './common/builderPalSection';

function HomeLt({ workshops }) {
  const user = useSelector((state) => state?.user);
  return (
    <div>
      {Config.Env === EnvironmentEnum.Production ? <BuilderComponent model="lt-live-home-1" /> : <BuilderComponent model="lt-live-home-1" />}
      {user?.branch?.allowEventBooking && (<EventsAndWorkshopsSection workshops={workshops} />)}
      {user?.institution?.isBuilderPalEnabled && (<BuilderPalSection />)}
      {Config.Env === EnvironmentEnum.Production ? <BuilderComponent model="lt-live-home-2" /> : <BuilderComponent model="lt-live-home-2" />}
    </div>
  );
}

export default HomeLt;
