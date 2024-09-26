
const isObject = function (o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const isArray = function (a) {
  return Array.isArray(a);
};

const toCamelCase = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const toSnakeCase = (s) => {  
  return s.split(/(?=[A-Z])/).join('_').toLowerCase();
};

export const toCamelCaseKeys = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamelCase(k)] = toCamelCaseKeys(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return toCamelCaseKeys(i);
    });
  }

  return o;
};

export const toSnakeCaseKeys = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toSnakeCase(k)] = toSnakeCaseKeys(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return toSnakeCaseKeys(i);
    });
  }

  return o;
};


export const shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export const getBase64 = async (file,cb,failedCb) => {
  if(file === null || file === undefined){
    cb(null);
    return;
  }
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async function () {
    cb(reader.result);
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
    if(failedCb !== undefined){
      failedCb();
    }
  };
}

export function timeSince(date) {
  var seconds = Math.floor((new Date() - new Date(date)) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ((Math.floor(interval) === 1)?" year":" years"); 
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ((Math.floor(interval) === 1)?" month":" months"); 
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ((Math.floor(interval) === 1)?" day":" days");
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ((Math.floor(interval) === 1)?" hour":" hours");
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ((Math.floor(interval) === 1)?" minute":" minutes");
  return Math.floor(interval) + ((Math.floor(interval) === 1)?" second":" seconds");
}

export function isUndefinedNull(...variables) {
  for (var variable in variables) {
    if (variable === undefined || variable === null) return true;
  }
  return false;
}