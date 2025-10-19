// Popup script for extension controls

let currentColor = '#ffff00';

// Initialize color selector
async function initColorSelector() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Get current color from content script
  chrome.tabs.sendMessage(tab.id, { action: 'getColor' }, (response) => {
    if (response && response.color) {
      currentColor = response.color;
      updateColorSelection();
    }
  });
  
  // Add click handlers to color options
  document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', async function() {
      currentColor = this.getAttribute('data-color');
      updateColorSelection();
      
      // Send color to content script
      chrome.tabs.sendMessage(tab.id, { 
        action: 'setColor', 
        color: currentColor 
      });
      
      showStatus('Color changed!');
    });
  });
}

function updateColorSelection() {
  document.querySelectorAll('.color-option').forEach(option => {
    if (option.getAttribute('data-color') === currentColor) {
      option.classList.add('selected');
    } else {
      option.classList.remove('selected');
    }
  });
}

function showStatus(message) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.display = 'block';
  setTimeout(() => {
    status.style.display = 'none';
  }, 3000);
}

// Export highlights to Markdown
document.getElementById('exportMarkdown').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'getHighlights' }, (response) => {
    if (response && response.highlights.length > 0) {
      let markdown = `# Highlights from ${response.url}\n\n`;
      markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
      markdown += `---\n\n`;
      
      response.highlights.forEach((h, index) => {
        const date = new Date(h.timestamp).toLocaleString();
        const colorName = getColorName(h.color);
        markdown += `## Highlight ${index + 1}\n\n`;
        markdown += `> ${h.text}\n\n`;
        markdown += `*Highlighted on: ${date}*  \n`;
        markdown += `*Color: ${colorName}*\n\n`;
        markdown += `---\n\n`;
      });
      
      downloadFile(markdown, 'highlights.md', 'text/markdown');
      showStatus('Exported to Markdown!');
    } else {
      showStatus('No highlights to export');
    }
  });
});

// Export highlights to JSON
document.getElementById('exportJSON').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { action: 'getHighlights' }, (response) => {
    if (response && response.highlights.length > 0) {
      const data = {
        url: response.url,
        exportDate: new Date().toISOString(),
        highlights: response.highlights
      };
      
      const json = JSON.stringify(data, null, 2);
      downloadFile(json, 'highlights.json', 'application/json');
      showStatus('Exported to JSON!');
    } else {
      showStatus('No highlights to export');
    }
  });
});

// Clear all highlights
document.getElementById('clearAll').addEventListener('click', async () => {
  if (confirm('Are you sure you want to clear all highlights on this page?')) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;
    
    const result = await chrome.storage.local.get(['highlights']);
    const allHighlights = result.highlights || {};
    delete allHighlights[url];
    await chrome.storage.local.set({ highlights: allHighlights });
    
    // Reload the page to remove highlights
    chrome.tabs.reload(tab.id);
    showStatus('All highlights cleared!');
  }
});

// Helper function to download files
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  chrome.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  });
}

// Get friendly color name
function getColorName(hex) {
  const colors = {
    '#ffff00': 'Yellow',
    '#ffb3ba': 'Pink',
    '#baffc9': 'Green',
    '#bae1ff': 'Blue',
    '#ffffba': 'Light Yellow',
    '#ffdfba': 'Orange',
    '#e0bbff': 'Purple',
    '#ffd1dc': 'Light Pink'
  };
  return colors[hex.toLowerCase()] || hex;
}

// Initialize when popup opens
initColorSelector();