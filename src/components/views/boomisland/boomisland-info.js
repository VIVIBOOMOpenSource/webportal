import "./boomisland-info.scss"
import React, { useState } from "react";
import Banner from "../../common/banner/banner"

import HomeTab from './tab-home';
import SubmissionsTab from './tab-submissions';
import RecordingsTab from './tab-recordings';
import SolidworksTab from './tab-solidworks';
import TinkercadTab from './tab-tinkercad';
import FusionTab from './tab-fusion';
import BlenderTab from './tab-blender';
import PaintTab from './tab-paint';
// import { ReactComponent as EventSvg } from "../../../css/imgs/icon-event.svg"
import BoomislandPoster from "../../../css/imgs/boom-imgs/boomisland/boomisland-poster.jpg"


const BoomlandInfo = () => {

  const [tab1, setTab1] = useState(0)
  const [tab2, setTab2] = useState(0)

  return (
    <div className="boomland-info">
      <Banner
        classAddOn="boomisland-icon"
      />

      <div className="section-header">
        <div className="section-header-info">
          <p className="section-pretitle">Hello explorers</p>
    
          <h2 className="section-title">Welcome to BOOM Island!</h2>
        </div>
      </div>
  
      <div className="grid grid-9-3">
        <div className="marketplace-slider">
          <div className="slider-panel">
            <div className="slider-panel-slides">
              <div className="slider-panel-slide">
                <figure className="slider-panel-slide-image">
                  <img src={BoomislandPoster} alt="poster"/>
                  {/* <video id="video" autoPlay muted loop>
                    Your browser does not support the video tag.
                  </video> */}
                </figure>
              </div>
            </div>
  
            {/* <div className="slider-panel-roster">
              <div className="slider-controls">
                <div className="slider-control" onClick={backButtonClick}>
                  <BackArrowSvg className="slider-control-icon"/>
                </div>
          
                <div className="slider-control" onClick={nextButtonClick}>
                  <ForwardArrowSvg className="slider-control-icon"/>
                </div>
              </div>
  
              <a className="button slider-button" href={links[sliderImagePosition]} target="_blank" rel="noopener noreferrer">Try It Yourself!</a>
              
              <div className="roster-pictures">
                {videos.map((v,i) => {return (
                  <div key={i} className={"roster-picture" + (i === sliderImagePosition ? " active" : "")} onClick={() => setSliderImagePosition(i)}>
                    <figure className="roster-picture-image">
                      <video autoPlay muted loop>
                        <source src={v} type="video/mp4"/>
                        Your browser does not support the video tag.
                      </video>
                    </figure>
                  </div>
                )})}
              </div>
            </div> */}
          </div>
        </div>
  
        <div className="marketplace-content">
  
          <div className="tab-box">
            <div className="tab-box-options">
              <div className={"tab-box-option" + (tab2 === 0 ? " active" : "")} onClick={() => setTab2(0)}>
                <p className="tab-box-option-title">Paint3D</p>
              </div>
              <div className={"tab-box-option" + (tab2 === 1 ? " active" : "")} onClick={() => setTab2(1)}>
                <p className="tab-box-option-title">SW Apps</p>
              </div>
              <div className={"tab-box-option" + (tab2 === 2 ? " active" : "")} onClick={() => setTab2(2)}>
                <p className="tab-box-option-title">TinkerCAD</p>
              </div>
              <div className={"tab-box-option" + (tab2 === 3 ? " active" : "")} onClick={() => setTab2(3)}>
                <p className="tab-box-option-title">Fusion 360</p>
              </div>
              <div className={"tab-box-option" + (tab2 === 4 ? " active" : "")} onClick={() => setTab2(4)}>
                <p className="tab-box-option-title">Blender</p>
              </div>
            </div>
            <div className="tab-box-items">
              <PaintTab show={tab2 === 0 ? true : false}/>
              <SolidworksTab show={tab2 === 1 ? true : false}/>
              <TinkercadTab show={tab2 === 2 ? true : false}/>
              <FusionTab show={tab2 === 3 ? true : false}/>
              <BlenderTab show={tab2 === 4 ? true : false}/>
            </div>
          </div>
        </div>
  
        <div className="marketplace-sidebar">
          <div className="tab-box">
            <div className="tab-box-options">
              <div className={"tab-box-option" + (tab1 === 0 ? " active" : "")} onClick={() => setTab1(0)}>
                <p className="tab-box-option-title">Home</p>
              </div>
              <div className={"tab-box-option" + (tab1 === 1 ? " active" : "")} onClick={() => setTab1(1)}>
                <p className="tab-box-option-title">Models</p>
              </div>
              {/* <div className={"tab-box-option" + (tab1 === 2 ? " active" : "")} onClick={() => setTab1(2)}>
                <p className="tab-box-option-title">Past Sessions</p>
              </div> */}
            </div>
            <div className="tab-box-items">
              <HomeTab show={tab1 === 0 ? true : false}/>
            </div>
            <div className="tab-box-items">
              <SubmissionsTab show={tab1 === 1 ? true : false}/>
            </div>
            {/* <div className="tab-box-items">
              <RecordingsTab show={tab1 === 2 ? true : false}/>
            </div> */}
          </div>
          {/* <div className="sidebar-box">
            <div className="sidebar-box-items">
              <p className="price-title big">3D Jamming <span className="currency">&</span> Modeling Sessions</p>
        
              <div className="checkbox-wrap">
                <EventSvg className="icon-event"/>
                <label className="date">Every Wednesday</label>
                <label className="date">2.30pm - 4.30pm</label>
      
          
                <p className="description">
                    Meet & Make: Character Design Jam - The Inhabitants of Boom Island (ONLINE)
                </p>
                <div className="checkbox-info">
                  <p className="checkbox-info-text">
                    For the month of July, every Wednesday afternoon, join Kenneth as he imagines what the inhabitants of Boom Island may look like! From outer space lifeforms to deep-sea organisms, he will be creating characters, creatures, and critters native to the creative world of Boom Island!
                  </p>
                </div>
              </div>

              <p className="description">Talk to us and join our sessions in the VIVIBOOM chat group #BOOMIsland!</p>
              <a className="button" href="/chat">Join the Group!</a>

            </div>
        
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default BoomlandInfo;