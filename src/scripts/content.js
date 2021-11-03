import LazyPt from './lazypt'

let lazypt = new LazyPt();

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if( request.message === "loaded" ) {
      lazypt.onLoad()
    }
  }
);