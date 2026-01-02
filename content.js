function addButton() {
  const target = document.querySelector('#top-level-buttons-computed');

  // Guard Clause: If the target container doesn't exist, do nothing.
  if (!target) {
    return;
  }

  // Guard Clause: If the button already exists in the target, do nothing.
  if (target.querySelector('#tubefile-add-button')) {
    return;
  }

  const addButton = document.createElement('button');
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

  addButton.addEventListener('click', () => {
    const currentUrl = new URL(window.location.href);
    const videoId = currentUrl.searchParams.get('v');
    if (videoId) {
      const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
      chrome.runtime.sendMessage({ action: 'addLink', url: cleanUrl }, (response) => {
        if (response.status === 'success' || response.status === 'duplicate') {
          console.log('TubeFile: Link action completed.');
          // Optional: give user feedback, e.g., change button text or color
          addButton.textContent = 'Added!';
          setTimeout(() => {
            addButton.textContent = 'Add';
          }, 2000);
        }
      });
    }
  });

  // Insert before the new like/dislike component
  const likeDislikeComponent = target.querySelector('segmented-like-dislike-button-view-model');
  if (likeDislikeComponent) {
      likeDislikeComponent.parentElement.insertBefore(addButton, likeDislikeComponent);
  } else {
      target.prepend(addButton);
  }
}

// YouTube uses a dynamic page structure, so we need to observe for changes
const observer = new MutationObserver(() => {
  addButton();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial try
setTimeout(addButton, 2000);
