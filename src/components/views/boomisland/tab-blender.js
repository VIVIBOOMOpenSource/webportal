
import Blender from "../../../css/imgs/boom-imgs/boomisland/blender.jpg"
import BlenderDownload from "../../../css/imgs/boom-imgs/boomisland/blender-download.png"
import BlenderExport from "../../../css/imgs/boom-imgs/boomisland/blender-export.png"

const BlenderTab = ({show}) => {

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
        <p className="tab-box-item-title">Blender</p>
        <figure className="tab-box-item-figure">
          <img src={Blender} alt="blender"/>
        </figure>
        <p className="tab-box-item-paragraph">
          Are you an experienced 3D modeler? Need something more powerful than Solid Works or Tinkercad? Why 
          not take up the challenge to learn Blender! Blender is a professional software used my many VFX 
          artists and animators. They work on the coolest projects like movies, video games, and fan-art.
          Ready to take up the challenge?
        </p>
        <p className="tab-box-item-title">Here's some video tutorials to get you started:</p>
        <p className="tab-box-item-paragraph">
          <li>
              <a className="link" href="https://youtu.be/TPrnSACiTJ4" target="_blank" rel="noopener noreferrer">Blender Beginner Tutorial</a>
          </li>
          <li>
              <a className="link" href="https://youtu.be/7MRonzqYJgw" target="_blank" rel="noopener noreferrer">Complete Beginners Guide to Blender</a>
          </li>
        </p>
        <p className="tab-box-item-title">To start using Blender:</p>
        <p className="tab-box-item-paragraph">
          1. Go to {" "}
          <a href="https://www.blender.org/download/" target="_blank" rel="noopener noreferrer">www.blender.org/download</a>
          {" "} If you are using a Macbook or iMac, select the "macOS" from the dropdown button.
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={BlenderDownload} alt="blender-download"/>
        </figure>
        <p className="tab-box-item-paragraph">
          2. Complete the Blender installation your computer and open Blender
        </p>
        <p className="tab-box-item-paragraph">
          3. After completing your modeling, select "File" &#8594; "Export" &#8594; ".glTF" to export your model
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={BlenderExport} alt="blender-export"/>
        </figure>
      </div>
    </div>
  )
}

export default BlenderTab;