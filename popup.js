document.addEventListener('DOMContentLoaded', function () {
    // Function to retrieve and display saved words
    function displaySavedWords() {
        chrome.storage.sync.get('words', function (data) {
            var words = data.words || [];
            var wordList = document.getElementById('wordList');
            wordList.innerHTML = ''; // Clear previous list
            words.forEach(function (word) {
                var li = document.createElement('li');
                li.textContent = word;
                // Add a delete button for each word
                var deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', function () {
                    deleteWord(word);
                });
                li.appendChild(deleteBtn);
                wordList.appendChild(li);
            });
        });
    }

    // Function to delete a word
    function deleteWord(wordToDelete) {
        chrome.storage.sync.get('words', function (data) {
            var words = data.words || [];
            var index = words.indexOf(wordToDelete);
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
