function addButton() {
  // Primary target: The usual action buttons row (Regular videos)
  let target = document.querySelector('#top-level-buttons-computed');

  // Fallback 1: Playlist/Mix pages often use a different structure or the ID changes
  // We check for the menu renderer in the video primary info
  if (!target) {
    target = document.querySelector('ytd-playlist-panel-video-renderer #menu #top-level-buttons-computed');
  }

  // Fallback 2: General "actions" container (often used in varying layouts)
  if (!target) {
    target = document.querySelector('#actions-inner #top-level-buttons-computed');
  }

  // Fallback 3: The owner container (Channel name area) - stable on smaller screens/older layouts
  if (!target) {
    target = document.querySelector('#owner');
  }

  // Fallback 4: For some playlist views, look for the flexible item menu
  if (!target) {
    target = document.querySelector('#menu-container #top-level-buttons-computed');
  }

  // Guard Clause: If NO target container exists, do nothing.
  if (!target) {
    return;
  }

  let addButton = document.getElementById('tubefile-add-button');

  // Create button if it doesn't exist
  if (!addButton) {
    addButton = document.createElement('button');
    addButton.id = 'tubefile-add-button';
    addButton.textContent = 'Add';

    // Basic styling to match YouTube's buttons
    addButton.style.marginRight = '8px';
    addButton.style.padding = '10px 16px';
    addButton.style.borderRadius = '20px';
    addButton.style.border = '1px solid #ccc';
    addButton.style.backgroundColor = '#f8f8f8';
    addButton.style.cursor = 'pointer';
    addButton.style.fontSize = '14px';
    addButton.style.fontWeight = '500';
    addButton.style.display = 'inline-flex';
    addButton.style.alignItems = 'center';

    addButton.addEventListener('click', handleAddClick);
  }

  // Ensure the button is actually IN the target we found.
  // If the button exists but is in a different (wrong/hidden) container, move it.
  if (!target.contains(addButton)) {
    const likeDislike = target.querySelector('segmented-like-dislike-button-view-model');
    const subscribeBtn = target.querySelector('#subscribe-button');

    if (likeDislike) {
      // Standard position: before like/dislike
      likeDislike.parentElement.insertBefore(addButton, likeDislike);
    } else if (subscribeBtn && target.id === 'owner') {
      // Fallback position for #owner: append to end
      target.appendChild(addButton);
      addButton.style.marginLeft = '10px';
    } else {
      // Generic fallback: prepend to target
      target.prepend(addButton);
    }
    // Reset checked state when moving to force a re-check
    addButton.dataset.checkedUrl = '';
  }

  // Check state for the current URL
  const currentUrl = new URL(window.location.href);
  const videoId = currentUrl.searchParams.get('v');
  if (videoId) {
    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Only check if we haven't checked this URL yet for this button instance
    if (addButton.dataset.checkedUrl !== cleanUrl) {
      checkLinkStatus(cleanUrl, addButton);
    }
  }
}

function handleAddClick() {
  const currentUrl = new URL(window.location.href);
  const videoId = currentUrl.searchParams.get('v');
  if (videoId) {
    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
    safeSendMessage({ action: 'addLink', url: cleanUrl }, (response) => {
      if (response && (response.status === 'success' || response.status === 'duplicate')) {
        console.log('TubeFile: Link action completed.');
        const btn = document.getElementById('tubefile-add-button');
        if (btn) {
          updateButtonState(btn, true);
          // Update the dataset so we don't re-check immediately and override
          btn.dataset.checkedUrl = cleanUrl;
        }
      }
    });
  }
}

function checkLinkStatus(url, button) {
  // Mark this URL as being checked so we don't spam the background script via MutationObserver calls
  button.dataset.checkedUrl = url;

  safeSendMessage({ action: 'checkLink', url: url }, (response) => {
    // Verify that we are still on the same URL for which we received the response
    const currentUrl = new URL(window.location.href);
    const videoId = currentUrl.searchParams.get('v');
    const currentCleanUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // If the valid URL is still the same, apply the state
    if (response && currentCleanUrl === url) {
      updateButtonState(button, response.exists);
    }
  });
}

function updateButtonState(button, isAdded) {
  if (isAdded) {
    button.textContent = 'Added';
    button.disabled = true;
    button.style.backgroundColor = '#e0e0e0';
    button.style.cursor = 'default';
    button.style.color = '#555';
  } else {
    button.textContent = 'Add';
    button.disabled = false;
    button.style.backgroundColor = '#f8f8f8';
    button.style.cursor = 'pointer';
    button.style.color = '';
  }
}

// YouTube uses a dynamic page structure, so we need to observe for changes
const observer = new MutationObserver(() => {
  if (!chrome.runtime?.id) {
    observer.disconnect();
    return;
  }
  addButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial try
setTimeout(addButton, 2000);

// Helper to safely send messages and handle invalid context
function safeSendMessage(message, callback) {
  if (chrome.runtime?.id) {
    try {
      chrome.runtime.sendMessage(message, (response) => {
        // Check if last error exists (generic error handling)
        if (chrome.runtime.lastError) {
          // console.warn("TubeFile: Runtime error:", chrome.runtime.lastError);
          return;
        }
        if (callback) callback(response);
      });
    } catch (e) {
      // console.warn("TubeFile: Context invalid, stopping execution.");
      if (observer) observer.disconnect();
    }
  } else {
    if (observer) observer.disconnect();
  }
}
