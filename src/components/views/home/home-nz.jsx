import React from 'react';
import './home-nz.scss';
import 'react-multi-carousel/lib/styles.css';

import { BuilderComponent } from '@builder.io/react';
import EnvironmentEnum from 'src/enums/environment';
import { useSelector } from 'react-redux';
import Config from 'src/config';
import EventsAndWorkshopsSection from './common/eventsAndWorkshopSection';
import BuilderPalSection from './common/builderPalSection';

function HomeNz({ workshops }) {
  const user = useSelector((state) => state?.user);
  return (
    <div>
      {Config.Env === EnvironmentEnum.Production ? <BuilderComponent model="nz-live-home-1" /> : <BuilderComponent model="nz-live-home-1" />}
      {user?.branch?.allowEventBooking && (<EventsAndWorkshopsSection workshops={workshops} />)}
      {user?.institution?.isBuilderPalEnabled && (<BuilderPalSection />)}
      {Config.Env === EnvironmentEnum.Production ? <BuilderComponent model="nz-live-home-2" /> : <BuilderComponent model="nz-live-home-2" />}
    </div>
  );
}

export default HomeNz;
