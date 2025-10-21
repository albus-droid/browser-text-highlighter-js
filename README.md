# Text Highlighter Extension

A simple, privacy-focused browser extension for highlighting text on any webpage with persistent storage and Markdown export capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Browser](https://img.shields.io/badge/browser-Chrome%20%7C%20Firefox-orange.svg)

## Features

- Multi-color highlighting with 8 preset colors
- Persistent storage that survives page reloads
- Export highlights to Markdown or JSON format
- Keyboard shortcuts for quick access
- Privacy-first design with local-only storage
- On-demand activation per page
- No tracking or analytics

## Installation

### Chrome

1. Download or clone this repository
2. Navigate to `chrome://extensions/`
3. Enable Developer mode (toggle in top right)
4. Click Load unpacked
5. Select the extension folder

### Firefox

1. Download or clone this repository
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click Load Temporary Add-on
4. Select any file from the extension folder (e.g., `manifest.json`)

## File Structure

```
text-highlighter/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for activation
├── texthighlight.js       # Main highlighting logic
├── texthighlight.css      # Minimal styling
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── highlight.png          # Extension icon
└── README.md              # Documentation
```

## Usage

### Activating the Extension

Choose one of these methods:

1. Click the extension icon in your toolbar, then click "Activate on This Page"
2. Use keyboard shortcut: `Ctrl+Shift+L` (`Cmd+Shift+L` on Mac)

A confirmation notification will appear when activated.

### Highlighting Text

1. Select any text on the webpage with your mouse
2. The text will be automatically highlighted in your chosen color
3. Double-click any highlight to remove it

### Changing Colors

1. Press `Shift+L` to open the color picker
2. Click any color to select it
3. New highlights will use the selected color

### Exporting Highlights

1. Click the extension icon to open the popup
2. Choose Export to Markdown or Export to JSON
3. The file will be downloaded automatically

### Clearing Highlights

1. Click the extension icon
2. Click Clear All Highlights to remove all highlights from the current page

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+L` (`Cmd+Shift+L` on Mac) | Activate extension on current page |
| `Shift+L` | Open color picker |
| `Ctrl+Shift+H` (`Cmd+Shift+H` on Mac) | Open extension popup |

## Available Colors

- Yellow (#ffff00)
- Pink (#ffb3ba)
- Green (#baffc9)
- Blue (#bae1ff)
- Light Yellow (#ffffba)
- Orange (#ffdfba)
- Purple (#e0bbff)
- Light Pink (#ffd1dc)

## Privacy

- All highlights are stored locally using `chrome.storage.local`
- No analytics or data collection
- No account required
- No cloud sync
- All data remains on your device

## Export Formats

### Markdown Export Example

```markdown
# Highlights from https://example.com

*Exported on 10/20/2025, 3:45 PM*

---

## Highlight 1

> This is your highlighted text

*Highlighted on: 10/20/2025, 2:30 PM*  
*Color: Yellow*

---
```

### JSON Export Example

```json
{
  "url": "https://example.com",
  "exportDate": "2025-10-20T15:45:00.000Z",
  "highlights": [
    {
      "id": 1729445678901.234,
      "text": "This is your highlighted text",
      "color": "#ffff00",
      "timestamp": "2025-10-20T14:30:00.000Z"
    }
  ]
}
```

## Development

### Prerequisites

- JavaScript, HTML, and CSS knowledge
- Chrome or Firefox browser
- Text editor

### Making Changes

1. Edit the source files
2. Reload the extension:
   - Chrome: Navigate to `chrome://extensions/` and click the refresh icon
   - Firefox: Click Reload in `about:debugging`

### Testing

1. Load the extension in your browser
2. Navigate to any webpage
3. Activate the extension
4. Test highlighting, color selection, and export functionality

## Browser Compatibility

- Chrome (Manifest V3)
- Firefox (Manifest V3)
- Edge (Chromium-based)

## License

MIT License - feel free to use and modify as needed.

## Credits

Icon: <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by mavadee - Flaticon</a>

## Contributing

Contributions are welcome. Please feel free to submit issues or pull requests.

## Known Limitations

- Does not work on browser internal pages (e.g., `chrome://`, `about:`)
- May have compatibility issues with highly dynamic websites
- Highlights are stored per-URL, so URL changes will create new highlight sets

## Support

For issues or questions, please open an issue on the repository.
