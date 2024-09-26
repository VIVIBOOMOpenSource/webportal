
import Tinkercad from "../../../css/imgs/boom-imgs/boomisland/tinkercad.png"
import TinkercadCreate from "../../../css/imgs/boom-imgs/boomisland/tinkercad-create.png"
import TinkercadDownload from "../../../css/imgs/boom-imgs/boomisland/tinkercad-download.png"
import TinkercadExport from "../../../css/imgs/boom-imgs/boomisland/tinkercad-export.png"
import TinkercadLogin from "../../../css/imgs/boom-imgs/boomisland/tinkercad-login.png"

const TinkercadTab = ({show}) => {

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
        <p className="tab-box-item-title">Tinkercad</p>
        <figure className="tab-box-item-figure">
          <img src={Tinkercad} alt="tinkercad"/>
        </figure>
        <p className="tab-box-item-paragraph">
          Many of you may have already worked with Tinkercad and even created models to 3D print. Well, good 
          news for you! You can immediately use these models and put them into BOOM Island! If you haven't used 
          Tinkercad before, fear not! It's easy to learn, and you'll be creating your own models in no time.
        </p>
        <p className="tab-box-item-title">Here's some video tutorials to get you started:</p>
        <p className="tab-box-item-paragraph">
          <li>
            <a className="link" href="https://youtu.be/gOs6Mdj7y_4" target="_blank" rel="noopener noreferrer">TinkerCAD - Tutorial for Beginners in 9 MINUTES!</a>
          </li>
          <li>
            <a className="link" href="https://youtube.com/playlist?list=PLt4JWLrDaOYmjyhE08HbNdsHMGKAmX6jG" target="_blank" rel="noopener noreferrer">Tinkercad Tutorials</a>
          </li>
        </p>
        <p className="tab-box-item-title">To start using Tinkercad:</p>
        <p className="tab-box-item-paragraph">
          1. Go to {" "}
          <a href="https://www.tinkercad.com/dashboard" target="_blank" rel="noopener noreferrer">www.tinkercad.com/dashboard</a>
          {" "} and login. Either create your own account or ask the crew for the login details.
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={TinkercadLogin} alt="tinkercad-login"/>
        </figure>
        <p className="tab-box-item-paragraph">
          2. Click the button "Create new design"
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={TinkercadCreate} alt="tinkercad-create"/>
        </figure>
        <p className="tab-box-item-paragraph">
          3. After completing your design, hit the "Export" button
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={TinkercadExport} alt="tinkercad-export"/>
        </figure>
        <p className="tab-box-item-paragraph">
          4. Select ".OBJ" to download the file
        </p>
        <figure className="tab-box-item-figure smaller">
          <img src={TinkercadDownload} alt="tinkercad-download"/>
        </figure>
      </div>
    </div>
  )
}

export default TinkercadTab;