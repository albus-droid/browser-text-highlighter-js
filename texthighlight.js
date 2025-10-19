// Content script for highlighting text
const HIGHLIGHT_CLASS = 'text-highlighter-mark';
let highlights = [];
let currentColor = '#ffff00'; // Default yellow

// Load highlights when page loads
async function loadHighlights() {
  const url = window.location.href;
  const result = await chrome.storage.local.get(['highlights']);
  const allHighlights = result.highlights || {};
  highlights = allHighlights[url] || [];
  restoreHighlights();
}

// Create a unique identifier for text position
function getTextPath(node) {
  const path = [];
  let current = node;
  
  while (current && current !== document.body) {
    if (current.nodeType === Node.TEXT_NODE) {
      const parent = current.parentNode;
      const index = Array.from(parent.childNodes).indexOf(current);
      path.unshift({ type: 'text', index });
      current = parent;
    } else {
      const parent = current.parentNode;
      if (parent) {
        const index = Array.from(parent.children).indexOf(current);
        path.unshift({ type: 'element', tag: current.tagName, index });
      }
      current = parent;
    }
  }
  
  return path;
}

// Find text node from path
function findNodeByPath(path) {
  let current = document.body;
  
  for (const step of path) {
    if (!current) return null;
    
    if (step.type === 'element') {
      current = current.children[step.index];
    } else if (step.type === 'text') {
      current = current.childNodes[step.index];
    }
  }
  
  return current;
}

// Save highlight
async function saveHighlight(range, color) {
  const startPath = getTextPath(range.startContainer);
  const endPath = getTextPath(range.endContainer);
  
  const highlight = {
    id: Date.now() + Math.random(),
    startPath,
    endPath,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
    text: range.toString(),
    color,
    timestamp: new Date().toISOString()
  };
  
  highlights.push(highlight);
  
  const url = window.location.href;
  const result = await chrome.storage.local.get(['highlights']);
  const allHighlights = result.highlights || {};
  allHighlights[url] = highlights;
  await chrome.storage.local.set({ highlights: allHighlights });
  
  applyHighlight(range, color, highlight.id);
}

// Apply visual highlight
function applyHighlight(range, color, id) {
  const span = document.createElement('span');
  span.className = HIGHLIGHT_CLASS;
  span.style.backgroundColor = color;
  span.style.cursor = 'pointer';
  span.style.transition = 'opacity 0.2s';
  span.setAttribute('data-highlight-id', id);
  span.setAttribute('data-highlight-color', color);
  
  // Add hover effect
  span.addEventListener('mouseenter', function() {
    this.style.opacity = '0.8';
  });
  span.addEventListener('mouseleave', function() {
    this.style.opacity = '1';
  });
  
  try {
    range.surroundContents(span);
  } catch (e) {
    // If surroundContents fails, use a different approach
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);
  }
}

// Restore highlights from storage
function restoreHighlights() {
  // Remove existing highlights first
  document.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => {
    const parent = el.parentNode;
    while (el.firstChild) {
      parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
  });
  
  // Apply saved highlights
  highlights.forEach(h => {
    try {
      const startNode = findNodeByPath(h.startPath);
      const endNode = findNodeByPath(h.endPath);
      
      if (startNode && endNode) {
        const range = document.createRange();
        range.setStart(startNode, h.startOffset);
        range.setEnd(endNode, h.endOffset);
        applyHighlight(range, h.color, h.id);
      }
    } catch (e) {
      console.error('Failed to restore highlight:', e);
    }
  });
}

// Handle text selection
document.addEventListener('mouseup', async (e) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText.length > 0 && !e.target.closest(`.${HIGHLIGHT_CLASS}`)) {
    const range = selection.getRangeAt(0);
    await saveHighlight(range, currentColor);
    selection.removeAllRanges();
  }
});

// Handle removing highlights
document.addEventListener('dblclick', async (e) => {
  if (e.target.classList.contains(HIGHLIGHT_CLASS)) {
    const id = parseFloat(e.target.getAttribute('data-highlight-id'));
    
    // Remove from storage
    highlights = highlights.filter(h => h.id !== id);
    const url = window.location.href;
    const result = await chrome.storage.local.get(['highlights']);
    const allHighlights = result.highlights || {};
    allHighlights[url] = highlights;
    await chrome.storage.local.set({ highlights: allHighlights });
    
    // Remove visual highlight
    const parent = e.target.parentNode;
    while (e.target.firstChild) {
      parent.insertBefore(e.target.firstChild, e.target);
    }
    parent.removeChild(e.target);
  }
});

// Listen for export request
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHighlights') {
    sendResponse({ highlights, url: window.location.href });
  } else if (request.action === 'setColor') {
    currentColor = request.color;
    sendResponse({ success: true });
  } else if (request.action === 'getColor') {
    sendResponse({ color: currentColor });
  }
});

// Initialize
loadHighlights();