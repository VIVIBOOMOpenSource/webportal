import { io } from 'socket.io-client';
import Config from 'src/config';

const socket = io(Config.Common.ApiBaseUrl);

export default socket;