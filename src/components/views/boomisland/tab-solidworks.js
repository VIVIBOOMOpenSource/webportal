

import SolidWorks from "../../../css/imgs/boom-imgs/boomisland/solidworks.jpg"
import SolidworksHome from "../../../css/imgs/boom-imgs/boomisland/solidworks-home.png"
import SolidworksModel from "../../../css/imgs/boom-imgs/boomisland/solidworks-model.png"
import SolidworksPrint from "../../../css/imgs/boom-imgs/boomisland/solidworks-print.png"
import SolidworksProfile from "../../../css/imgs/boom-imgs/boomisland/solidworks-profile.png"
import SolidworksRegister from "../../../css/imgs/boom-imgs/boomisland/solidworks-register.png"

const SolidworksTab = ({show}) => {

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
        <p className="tab-box-item-title">Solid Works</p>
        <figure className="tab-box-item-figure">
          <img src={SolidWorks} alt="solid works"/>
        </figure>
        <br/>
        <p className="tab-box-item-paragraph">
          Solid Works Apps for Kids is a really simple and fun 3D modeler where you can create and share 
          anything you can think of! It's really great for beginners, so if you haven't done 3D modeling 
          before, this is perfect for you!
        </p>

        <p className="tab-box-item-title">Here's some video tutorials to get you started:</p>
        <p className="tab-box-item-paragraph">
          <li>
            <a className="link" href="https://www.swappsforkids.com/videos/" target="_blank" rel="noopener noreferrer">Solid Works Videos</a>
          </li>
          <li>
          <a className="link" href="https://youtube.com/playlist?list=PLiKqXuECiKNK34mM23lkbQ66Bv_oqzGlG" target="_blank" rel="noopener noreferrer">SOLIDWORKS Apps for Kids</a>
          </li>
        </p>

        <p className="tab-box-item-title">To start using Solid Works:</p>
        <p className="tab-box-item-paragraph">
          1. Go to {" "}
          <a href="https://www.swappsforkids.com/" target="_blank" rel="noopener noreferrer">www.swappsforkids.com</a>
          {" "} and click on "Try Now"
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={SolidworksHome} alt="sw-home"/>
        </figure>
        <p className="tab-box-item-paragraph">
          2. Register for an account (if you don't have an email account, ask your parent to help you)
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={SolidworksRegister} alt="sw-register"/>
        </figure>
        <p className="tab-box-item-paragraph">
          3. Click on the plus button to create a new model
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={SolidworksProfile} alt="sw-profile"/>
        </figure>
        <p className="tab-box-item-paragraph">
          4. After creating your model, click on the apps button and select "Print It"
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={SolidworksModel} alt="sw-model"/>
        </figure>
        <p className="tab-box-item-paragraph">
          5. Click "3D Print" and select "Download STL"
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={SolidworksPrint} alt="sw-print"/>
        </figure>
        <p className="tab-box-item-paragraph">
          6. Now you have your downloaded model which you can upload to your VIVIBOOM project! Remember to take photos too!
        </p>
      </div>
    </div>
  )
}

export default SolidworksTab;