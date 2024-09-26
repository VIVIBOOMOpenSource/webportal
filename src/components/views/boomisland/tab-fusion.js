
import Fusion from "../../../css/imgs/boom-imgs/boomisland/fusion.jpg"
import FusionLogin from "../../../css/imgs/boom-imgs/boomisland/fusion-login.png"
import FusionModel from "../../../css/imgs/boom-imgs/boomisland/fusion-model.png"
import FusionExport from "../../../css/imgs/boom-imgs/boomisland/fusion-export.png"

const FusionTab = ({show}) => {

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
        <p className="tab-box-item-title">Fusion 360</p>
        <figure className="tab-box-item-figure">
          <img src={Fusion} alt="fusion"/>
        </figure>
        <p className="tab-box-item-paragraph">
          Building a model that requires high precision like a racecar or spaceship? Consider using Fusion 360! 
          Designed for engineers, Fusion gives you the best tools to have complete control over the fit and 
          form of your design. It is used by designers to model and create real-world products like tools, 
          machines, cars, and so much more.
        </p>
        <p className="tab-box-item-title">Here's some video tutorials to get you started:</p>
        <p className="tab-box-item-paragraph">
          <li>
              <a className="link" href="https://youtu.be/qvrHuaHhqHI" target="_blank" rel="noopener noreferrer">Fusion 360 Tutorial for Absolute Beginners</a>
          </li>
          <li>
              <a className="link" href="https://youtu.be/mK60ROb2RKI" target="_blank" rel="noopener noreferrer">LEARN FUSION 360 FAST!</a>
          </li>
        </p>
        <p className="tab-box-item-title">To start using Fusion 360:</p>
        <p className="tab-box-item-paragraph">
          1. Click the link {" "}
            <a href="https://dl.appstreaming.autodesk.com/production/installers/Fusion%20360%20Admin%20Install.exe" target="_blank" rel="noopener noreferrer">dl.appstreaming.autodesk.com/production/installers/Fusion%20360%20Admin%20Install.exe</a>
          {" "} to download Fusion 360. 
        </p>
        <p className="tab-box-item-paragraph">
          2. Complete the Fusion 360 installation your computer and open it. If you don't have an account, ask the crew for the login details.
        </p>
        <p className="tab-box-item-paragraph">
          3. After completing your model, click on "File" &#8594; "export"
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={FusionModel} alt="fusion-model"/>
        </figure>
        <p className="tab-box-item-paragraph">
          4. Leave the format as default ".f3d" and hit "Export"
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={FusionExport} alt="fusion-export"/>
        </figure>
      </div>
    </div>
  )
}

export default FusionTab;