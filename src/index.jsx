import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { builder } from '@builder.io/react';
import App from './app';
import reportWebVitals from './reportWebVitals';
import Config from './config';
import { store } from './redux/store';
import 'src/socket';
import 'src/translations/i18n';

// Set up old reactn store(deprecating)
import initStore from './store/store';

initStore();
const persistor = persistStore(store);

// Set up Builder.io
builder.init(Config.Common.BuilderAppId);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
