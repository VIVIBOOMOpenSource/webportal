

export const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const tryJSONParse = (s) => {
  let res = null;
  try{
    res = JSON.parse(s);
  }catch(e){
    console.log("Failed to parse string("+s+")");
  }
  return res;
};

export const urlEncode = (str) => {
  str = (str + '').toString();
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/\+/,'%252B')
    .replace(/%20/g, '+')
    .replace(/~/g, '%7E');
};

export const urlDecode = (str) => {
  str = (str + '').toString();
  return decodeURIComponent(str)
    .replace(/%21/g, '!')
    .replace(/%27/g, "'")
    // .replace(/%28/g, '\(')
    // .replace(/%29/g, '\)')
    // .replace(/%2A/g, '\*')
    // .replace(/%252B/,'\+')
    .replace(/\+/g, '%20')
    .replace(/%7E/g, '~');
};

export const prettyPrintJson = (str) => {
  var ugly = str;
  var obj = JSON.parse(ugly);
  var pretty = JSON.stringify(obj, undefined, 4);
  return pretty;
}

export const prettifyCamelCase = (str) => {
  return str
        // insert a space before all caps
        .replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str){ return str.toUpperCase(); })
}

export const camelCaseToSnakeCase = (str) => {
  return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}
export const camelCaseToKebabCase = (str) => {
  return str.split(/(?=[A-Z])/).join('-').toLowerCase();
}

