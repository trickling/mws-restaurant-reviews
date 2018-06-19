// module "util.js"

// This code was copied from an example given at:
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// by Mozilla Contributors (MDN), is licensed under CC-BY-SA 2.5, or all open source licenses.

function imgLoad(url) {
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    // if (url.includes('placeholder')){
    //   request.open('GET', url + '.svg');
    // } else {
    //   request.open('GET', url + '.jpg');
    // }
    request.responseType = 'blob';

    request.onload = function() {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    request.send();
  });
}
