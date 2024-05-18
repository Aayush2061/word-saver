// Function to send a message to the background script to save the selected word
function saveWord(selectedWord) {
    chrome.runtime.sendMessage({ action: 'saveWord', word: selectedWord }, function (response) {
        console.log(response.message);
    });
}
