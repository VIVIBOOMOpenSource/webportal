import {toast} from 'react-toastify';
import { useEffect, useGlobal, useState } from 'reactn';
import Config from '../config';
import useUserState from './user';

import {request} from '../utils/request';

import NotificationTypeEnum from '../enums/NotificationType';

// We may want to make a Socket Util like request
// Infact, yes let's make one later
// Util needs to auto reconnect if response takes too long & handle errors
const useNotificationsState = () => {

  const {user} = useUserState();
  const [notifications, setNotifications] = useGlobal('notifications'); 
  const [notifLimit,setNotifLimit] = useState(24);

  // useEffect(() => {
  //   let socket = new WebSocket(Config.Common.ApiBaseWss);

  //   let json = {
  //     event: "subscribe",
  //     data: {
  //       "channel": "notifications",
  //       "user": user,
  //       "notifLimit": notifLimit,
  //     }
  //   }

  //   socket.addEventListener('open', function (event) {
  //     socket.send(JSON.stringify(json));
  //   });

  //   socket.addEventListener('message', function (event) {
  //     let data = JSON.parse(event.data);
  //     let newResults = [];
  //     if(data.err.code){
  //       toast.error(data.err.message);
  //       socket.close();
  //     }else{
  //       newResults = data.res;
  //     }
  //     setNotifications(JSON.stringify(newResults))
  //   });

  //   return () => {
  //     socket.close();
  //   }

  // },[user,setNotifications,notifLimit]);

  const updateSeenNotifications = (ids) => {  
    if(ids.length <= 0){
      return;
    }
    request("update-seen-notifications","/notifications","PATCH", {ids:ids}, {
      then: function(res){},  
      catch: function(err){},
      finally: function(){}
    });
  }


  return {notifications, updateSeenNotifications, setNotifications, notifLimit, setNotifLimit};
}

export default useNotificationsState;