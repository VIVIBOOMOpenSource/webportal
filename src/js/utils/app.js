import XM_Popup from '../vendor/xm_popup';
import XM_Tab from '../vendor/xm_tab';
import XM_Hexagon from '../vendor/xm_hexagon';

const app = {
  deepExtend(a, b) {
    for (const prop in b) {
      if (typeof b[prop] === 'object') {
        a[prop] = b[prop] instanceof Array ? [] : {};
        this.deepExtend(a[prop], b[prop]);
      } else {
        a[prop] = b[prop];
      }
    }
  },
  query(options) {
    const config = {
      method: 'GET',
      async: true,
      header: {
        type: 'Content-type',
        value: 'application/json',
      },
      data: '',
    };

    this.deepExtend(config, options);

    return new Promise((resolve, reject) => {
      const xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function () {
        if (xhttp.readyState !== 4) return;

        if (xhttp.status === 200) {
          resolve(xhttp.responseText);
        } else {
          reject({
            status: xhttp.status,
            statusText: xhttp.statusText,
          });
        }
      };

      xhttp.open(config.method, config.url, config.async);
      xhttp.setRequestHeader(config.header.type, config.header.value);

      if (config.method === 'GET') {
        xhttp.send();
      } else if (config.method === 'POST') {
        xhttp.send(config.data);
      }
    });
  },
  querySelector(selector, callback) {
    const el = document.querySelectorAll(selector);

    if (el.length) {
      callback(el);
    }
  },
  liquidify(el) {
    const image = el.querySelector('img');
    const imageSrc = image.getAttribute('src');

    image.style.display = 'none';
    el.style.background = `url("${imageSrc}") no-repeat center`;
    el.style.backgroundSize = 'cover';
  },
  liquidifyStatic(figure, image) {
    image.style.display = 'none';
    figure.style.background = `url("${image.getAttribute('src')}") no-repeat center`;
    figure.style.backgroundSize = 'cover';
  },
  existsInDOM(selector) {
    return document.querySelectorAll(selector).length;
  },
  plugins: {
    createTab(options) {
      if (app.existsInDOM(options.triggers) && app.existsInDOM(options.elements)) {
        return new XM_Tab(options);
      }
    },
    createPopup(options) {
      if (app.existsInDOM(options.container) && app.existsInDOM(options.trigger)) {
        return new XM_Popup(options);
      }
    },
    createHexagon(options) {
      if (app.existsInDOM(options.container) || typeof options.containerElement !== 'undefined') {
        return new XM_Hexagon(options);
      }
    },
  },
};

export { app };
