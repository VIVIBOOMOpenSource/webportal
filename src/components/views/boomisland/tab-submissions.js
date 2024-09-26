
import React, { useState, useEffect } from "react";
import ProjectItem from "../projects/project-item";
import Loading from "../../common/loading/loading";
import { request } from "../../../utils/request";
import { toast } from "react-toastify";

const SubmissionsTab = ({show}) => {

  useEffect(() => {
    searchProjects();
  }, []);

  const [projectIds, setProjectIds] = useState([]);
  const [loading, setLoading] = useState(false);
    

  const searchProjects = () => {
    let endpoint = "/projects-search";
    // endpoint += "?query=" + query;
    // endpoint += "&filter=" + filter;
    // endpoint += "&order=" + order;
    // endpoint += "&category=" + category;
    endpoint += "?category=BOOM Island";
    endpoint += "&page=" + 1;
    endpoint += "&limit=" + 25;
    endpoint += "&query=";

    setLoading(true);
    request( "project-search", endpoint, "GET", {},
      {
        then: function (res) {
          setProjectIds(res.data.res.projects.map((p) => p.id));
        },
        catch: function (err) {
          toast.error(err.message);
        },
        finally: function () {
          setLoading(false);
        },
      }
    );
  };

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
          
        <p className="tab-box-item-title">Inhabitants of BOOM Island</p>
        <Loading show={loading} size="40px" />
        <ul className="project-container">
          {projectIds.map((v, i) => {
            return (
              <li key={i}>
              <ProjectItem id={v} />
              </li>
            );
          })}
        </ul>

        {/* <p className="tab-box-item-paragraph">
          A cool virtual interactive world where VIVINAUTS will be able to explore the world they've helped 
          create! Yes, every object in this world is created by a VIVINAUT! Submit your creations to us. It
          can be anything you want - a train, roller coaster, flying unicorn, Marvel universe, anything!
        </p>

        <p className="tab-box-item-title">How To Join and Get Started?</p>

        <p className="tab-box-item-paragraph">
          Share your 3D files and creations with us in the VIVIBOOM chat group "#BOOMIsland". If you want someone 
          to do 3D jamming together with you, shout out in the group and we'll create magic together!
        </p>
        <p className="tab-box-item-paragraph">
          Maybe you just need to watch someone else model to get that spark of inspiration, or you already have an 
          idea but just want to run it by somebody? Drop by our 3D Jamming and Modeling Sessions to watch our Crew 
          members, Shannon, Ryan, and Puspita brainstorm and create their own designs.
        </p>
        <p className="tab-box-item-paragraph">
        To join and get started, go to <a href="/chat">https://viviboom.co/chat</a> and join the <a href="/chat">#BOOMIsland!</a> group!
          Video calls and discussion sessions will be done in this group.
        </p>
        <a className="button" href="/chat">Join the chat!</a> */}
      </div>
    </div>

  )
}

export default SubmissionsTab;