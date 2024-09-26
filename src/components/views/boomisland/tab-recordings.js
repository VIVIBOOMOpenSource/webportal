

const RecordingsTab = ({show}) => {

  return (
    <div  className={"tab-box-item" + (show ? " active" : "")}>
      <div className="tab-box-item-content">
        <p className="tab-box-item-title">3D Jamming and Modeling Session 1</p>
        <p className="tab-box-item-paragraph">Monday, 21 June 2021</p>
        <div className="iframe-wrap">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/DJkk39EFMNg" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
        <div className="iframe-wrap">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/Pmz6G26wCiw" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
        <div className="iframe-wrap">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/PXGKTvSqB-U" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
        <p className="tab-box-item-title">3D Jamming and Modeling Session 2</p>
        <p className="tab-box-item-paragraph">Coming soon!</p>
      </div>
    </div>
  )
}

export default RecordingsTab;