import PtUtils from './ptutils'

let pt = new PtUtils();

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if( request.message === "loaded" ) {
      pt.onLoad()
    }
  }
);