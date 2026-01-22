chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['links'], (result) => {
    if (result.links === undefined) {
      chrome.storage.local.set({ links: [] });
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addLink') {
    chrome.storage.local.get({links: []}, (result) => {
      const links = result.links;
      if (!links.includes(request.url)) {
        links.push(request.url);
        chrome.storage.local.set({ links: links }, () => {
          sendResponse({ status: 'success' });
        });
      } else {
        sendResponse({ status: 'duplicate' });
      }
    });
    return true; // Return true for async response
  } else if (request.action === 'clearAll') {
    chrome.storage.local.set({ links: [] }, () => {
      sendResponse({ status: 'success' });
    });
    return true; // Return true for async response
  } else if (request.action === 'deleteOne') {
    chrome.storage.local.get({ links: [] }, (result) => {
      let links = result.links;
      const filteredLinks = links.filter(link => link !== request.url);
      chrome.storage.local.set({ links: filteredLinks }, () => {
        sendResponse({ status: 'success' });
      });
    });
    return true; // Return true for async response
  }
});
