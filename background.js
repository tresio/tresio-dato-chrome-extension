(function() {

  const tabStorage = {};
  const networkFilters = {
    urls: [
      "*://*.datocms.com/items*",
      "*://*.datocms.com/validate*",
      "*://*.datocms.com/editing-sessions*",
    ]
  };

  function custom_callback(data) {
    console.log("callback", data);
  }

  chrome.webRequest.onBeforeRequest.addListener((details) => {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId)) {
      return;
    }

    tabStorage[tabId].requests[requestId] = {
      requestId: requestId,
      url: details.url,
      startTime: details.timeStamp,
      status: 'pending'
    };
    chrome.tabs.sendMessage(tabId, {text: 'xhr_complete'}, custom_callback);
  }, networkFilters);

  chrome.webRequest.onCompleted.addListener((details) => {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
      return;
    }

    const request = tabStorage[tabId].requests[requestId];

    Object.assign(request, {
      endTime: details.timeStamp,
      requestDuration: details.timeStamp - request.startTime,
      status: 'complete'
    });

  }, networkFilters);

  chrome.webRequest.onErrorOccurred.addListener((details)=> {
    const { tabId, requestId } = details;
    if (!tabStorage.hasOwnProperty(tabId) || !tabStorage[tabId].requests.hasOwnProperty(requestId)) {
      return;
    }

    const request = tabStorage[tabId].requests[requestId];
    Object.assign(request, {
      endTime: details.timeStamp,
      status: 'error',
    });
  }, networkFilters);

  chrome.tabs.onActivated.addListener((tab) => {
    const tabId = tab ? tab.tabId : chrome.tabs.TAB_ID_NONE;
    if (!tabStorage.hasOwnProperty(tabId)) {
      tabStorage[tabId] = {
        id: tabId,
        requests: {},
        registerTime: new Date().getTime()
      };
    }
  });
  chrome.tabs.onRemoved.addListener((tab) => {
    const tabId = tab.tabId;
    if (!tabStorage.hasOwnProperty(tabId)) {
      return;
    }
    tabStorage[tabId] = null;
  });

})();