import { ReactComponent as EventSvg } from "../../../css/imgs/icon-event.svg"

const HomeTab = ({show}) => {

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
        <p className="tab-box-item-title">What is BOOM Island?</p>

        <p className="tab-box-item-paragraph">
          A cool virtual interactive world where VIVINAUTS will be able to explore the world they've helped 
          create! Yes, every object in this world is created by a VIVINAUT! Submit your creations to us. It
          can be anything you want - a train, roller coaster, flying unicorn, Marvel universe, anything!
        </p>

        <p className="tab-box-item-title">How To Join and Get Started?</p>

        <p className="tab-box-item-paragraph">
          Share your 3D files and creations with us in the VIVIBOOM chat group "#BOOMIsland". If you want someone 
          to do 3D jamming together with you, shout out in the group and we'll create magic together!
        </p>
        <a className="button" href="/chat">Join the chat!</a>
      </div>
    </div>

  )
}

export default HomeTab;