document.addEventListener('DOMContentLoaded', () => {
  const linksList = document.getElementById('links-list');
  const downloadButton = document.getElementById('download-button');
  const clearAllButton = document.getElementById('clear-all-button');

  function renderLinks() {
    chrome.storage.local.get({ links: [] }, (result) => {
      const links = result.links;
      linksList.innerHTML = ''; // Clear the list before rendering

      if (links.length > 0) {
        links.forEach((link) => {
          const li = document.createElement('li');
          
          const linkText = document.createElement('span');
          linkText.className = 'link-text';
          linkText.textContent = link;
          li.appendChild(linkText);

          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-item-btn';
          deleteButton.textContent = 'X';
          deleteButton.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'deleteOne', url: link }, (response) => {
              if (response.status === 'success') {
                renderLinks(); // Re-render the list
              }
            });
          });
          li.appendChild(deleteButton);
          
          linksList.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = "No links saved.";
        linksList.appendChild(li);
      }
    });
  }

  // Initial render
  renderLinks();

  // Handle download
  downloadButton.addEventListener('click', () => {
    chrome.storage.local.get({ links: [] }, (result) => {
      const links = result.links;
      if (links.length > 0) {
        const content = links.join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    });
  });

  // Handle Clear All
  clearAllButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'clearAll' }, (response) => {
      if (response.status === 'success') {
        renderLinks(); // Re-render the list (which will now be empty)
      }
    });
  });
});

