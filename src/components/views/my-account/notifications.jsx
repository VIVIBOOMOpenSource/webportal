import React, { useState } from 'react';
import './notifications.scss';

import SwitchToggle from '../../common/switch-toggle/switch-toggle';

function Notifications() {
  const [disableNotifs, setDisableNotifs] = useState(true);
  const [badgeAwards, setBadgeAwards] = useState(true);
  const [projectStatus, setProjectStatus] = useState(true);
  const [projectLikes, setProjectLikes] = useState(true);
  const [commentReply, setCommentReply] = useState(true);
  const [commentLikes, setCommentLikes] = useState(true);

  const [loading, setLoading] = useState(false);

  return (
    <div className="notifications general-setting">
      <h3>Notifications</h3>

      <div className="switch-toggle-form">
        <label>Enable Notifications</label>
        <SwitchToggle
          isOn={disableNotifs}
          onClickFunc={() => setDisableNotifs(!disableNotifs)}
          loading={loading}
        />
      </div>

      <div className="switch-toggle-form">
        <label>Badge Awards</label>
        <SwitchToggle
          isOn={badgeAwards}
          onClickFunc={() => setBadgeAwards(!badgeAwards)}
          loading={loading}
        />
      </div>

      <div className="switch-toggle-form">
        <label>Project Approval/Rejection</label>
        <SwitchToggle
          isOn={projectStatus}
          onClickFunc={() => setProjectStatus(!projectStatus)}
          loading={loading}
        />
      </div>

      <div className="switch-toggle-form">
        <label>Project Likes</label>
        <SwitchToggle
          isOn={projectLikes}
          onClickFunc={() => setProjectLikes(!projectLikes)}
          loading={loading}
        />
      </div>

      <div className="switch-toggle-form">
        <label>Comment Replies</label>
        <SwitchToggle
          isOn={commentReply}
          onClickFunc={() => setCommentReply(!commentReply)}
          loading={loading}
        />
      </div>

      <div className="switch-toggle-form">
        <label>Comment Likes</label>
        <SwitchToggle
          isOn={commentLikes}
          onClickFunc={() => setCommentLikes(!commentLikes)}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default Notifications;
