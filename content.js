// Function to send a message to the background script to save the selected word
function saveWord(selectedWord) {
    chrome.runtime.sendMessage({ action: 'saveWord', word: selectedWord }, function (response) {
        console.log(response.message);
    });
}

// // Listen for mouseup event to detect right-clicks
// document.addEventListener('mouseup', function (event) {
//     if (event.button === 2) { // Right mouse button clicked
//         const selectedWord = window.getSelection().toString().trim();
//         if (selectedWord) {
//             saveWord(selectedWord);
//         }
//     }
// });
