document.addEventListener('DOMContentLoaded', function () {
    // Function to retrieve and display saved words
    function displaySavedWords() {
        chrome.storage.sync.get('words', function (data) {
            var words = data.words || [];
            var wordList = document.getElementById('wordList');
            wordList.innerHTML = ''; // Clear previous list

            if (words.length === 0) {
                var li = document.createElement('li');
                li.textContent = 'No words saved.';
                wordList.appendChild(li);
            } else {
                words.forEach(function (entry) {
                    if (entry.word && entry.timestamp) { // Ensure entry has word and timestamp
                        var li = document.createElement('li');
                        li.textContent = `${entry.word} (Saved on: ${entry.timestamp})`;
                        // Add a delete button for each word
                        var deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.addEventListener('click', function () {
                            deleteWord(entry.word);
                        });
                        li.appendChild(deleteBtn);
                        wordList.appendChild(li);
                    }
                });
            }
        });
    }

    // Function to delete a word
    function deleteWord(wordToDelete) {
        chrome.storage.sync.get('words', function (data) {
            var words = data.words || [];
            var index = words.findIndex(entry => entry.word === wordToDelete);
            if (index !== -1) {
                words.splice(index, 1);
                chrome.storage.sync.set({ words: words }, function () {
                    console.log('Word deleted successfully: ' + wordToDelete);
                    // Update UI after deletion
                    displaySavedWords();
                });
            }
        });
    }

    // Display saved words when the popup is opened
    displaySavedWords();
});
