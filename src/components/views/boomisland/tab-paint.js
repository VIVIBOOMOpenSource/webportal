import Config from "../../../config";
import { builder, BuilderComponent } from "@builder.io/react";
import '@builder.io/widgets';

builder.init(Config.Common.BuilderAppId);

const PaintTab = ({show}) => {

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
        {Config.Env === "Production" ? <BuilderComponent model="paint-3-d-guide" /> : <BuilderComponent model="paint-3-d" />}
      </div>
    </div>
  )
}

export default PaintTab;