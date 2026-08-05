/**
 * TabSense Extension Popup Script
 * 
 * This script handles user interactions in the popup.
 * Specifically, it listens for click events on the "Save Current Session" button,
 * retrieves all open browser tabs, extracts key details (title, url, favicon),
 * and prints them to the browser's extension console.
 */

document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('save-session-btn');
  const statusContainer = document.getElementById('status-container');
  const statusText = document.getElementById('status-text');

  if (!saveBtn) {
    console.error('Save button element not found in DOM.');
    return;
  }

  // Handle click event on the "Save Current Session" button
  saveBtn.addEventListener('click', async () => {
    try {
      // Query all open tabs in all windows.
      // Under Manifest V3, chrome.tabs.query returns a Promise if no callback is provided.
      const tabs = await chrome.tabs.query({});
      
      // Extract only the required fields: title, url, favIconUrl
      const capturedTabs = tabs.map(tab => ({
        title: tab.title || '',
        url: tab.url || '',
        favIconUrl: tab.favIconUrl || ''
      }));

      // Log the captured tabs array to the browser extension's DevTools console
      console.log('Captured Session Tabs:', capturedTabs);

      // Display dynamic success feedback inside the popup UI
      if (statusContainer && statusText) {
        statusText.textContent = `Captured ${capturedTabs.length} tab${capturedTabs.length === 1 ? '' : 's'} successfully!`;
        statusContainer.style.display = 'flex';

        // Auto-dismiss the status toast after 3 seconds for a clean UX
        setTimeout(() => {
          statusContainer.style.display = 'none';
        }, 3000);
      }

    } catch (error) {
      console.error('Error querying browser tabs:', error);
      
      // Display error feedback if something goes wrong
      if (statusContainer && statusText) {
        statusText.textContent = 'Failed to capture tabs.';
        statusContainer.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; // Red tint
        statusContainer.style.borderColor = 'rgba(239, 68, 68, 0.2)';
        statusContainer.style.color = '#f87171'; // Red text
        statusContainer.style.display = 'flex';
      }
    }
  });
});
