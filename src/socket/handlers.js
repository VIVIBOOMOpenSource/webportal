import { store } from 'src/redux/store';
import { SocketEventType } from 'src/enums/SocketEventType';
import NotificationReduxActions from 'src/redux/notification/NotificationReduxActions';
import socket from './init';

socket.on('connected', () => {
  const authToken = store?.getState()?.user?.authToken;
  if (authToken) {
    socket.emit('authToken', authToken);
  }
});

socket.on('authentication_successful', () => {
});

socket.onAny((eventName, args) => {
  console.log('SocketEvent', eventName, args);
  if (eventName === SocketEventType.NEW_NOTIFICATION) NotificationReduxActions.fetch();
});
