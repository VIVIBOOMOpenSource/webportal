import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import { BuilderComponent } from '@builder.io/react';

import Config from 'src/config';
import EnvironmentEnum from 'src/enums/environment';
import { useSelector } from 'react-redux';
import './home-ph.scss';
import EventsAndWorkshopsSection from './common/eventsAndWorkshopSection';
import BuilderPalSection from './common/builderPalSection';

function HomePh({ workshops }) {
  const user = useSelector((state) => state?.user);
  return (
    <div>
      {Config.Env === EnvironmentEnum.Production ? <BuilderComponent model="ph-live-home-1" /> : <BuilderComponent model="ph-live-home-1" />}
      {user?.branch?.allowEventBooking && (<EventsAndWorkshopsSection workshops={workshops} />)}
      {user?.institution?.isBuilderPalEnabled && (<BuilderPalSection />)}
      {Config.Env === EnvironmentEnum.Production ? <BuilderComponent model="ph-live-home-2" /> : <BuilderComponent model="ph-live-home-2" />}
    </div>
  );
}

export default HomePh;
