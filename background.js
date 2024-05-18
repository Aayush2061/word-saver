// Function to save the selected word with timestamp
function saveWord(selectedWord) {
    chrome.storage.sync.get('words', function (data) {
        var words = data.words || [];
        var timestamp = new Date().toLocaleString(); // Get current date and time
        words.push({ word: selectedWord, timestamp: timestamp }); // Store word with timestamp
        chrome.storage.sync.set({ words: words }, function () {
            console.log('Word saved successfully: ' + selectedWord + ' at ' + timestamp);
            console.log('Current words in storage:', words);
        });
    });
}

// Initialize context menu when extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
    // Create context menu item
    chrome.contextMenus.create({
        id: "saveWordContextMenu",
        title: "Save",
        contexts: ["selection"]
    });
});

// Add listener for context menu item click
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "saveWordContextMenu") {
        saveWord(info.selectionText.trim());
    }
});

// Message listener to handle saving words from content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'saveWord') {
        saveWord(request.word);
        sendResponse({ message: 'Word saved successfully' });
    }
});
