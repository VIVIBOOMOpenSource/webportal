import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

history.listen((location, action) => {
  window.dispatchEvent(new Event('popstate'));
});

export default history;