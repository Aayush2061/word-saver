document.addEventListener('DOMContentLoaded', function () {
    // Function to retrieve and display saved words grouped by date with word count
    function displaySavedWords() {
        chrome.storage.sync.get('words', function (data) {
            var words = data.words || [];
            var wordList = document.getElementById('wordList');
            wordList.innerHTML = ''; // Clear previous list

            if (words.length === 0) {
                var li = document.createElement('li');
                li.className = 'no-words';
                li.textContent = 'No words saved.';
                wordList.appendChild(li);
            } else {
                // Group words by date
                var groupedWords = words.reduce((acc, entry) => {
                    var date = new Date(entry.timestamp).toLocaleDateString();
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(entry.word);
                    return acc;
                }, {});

                // Display grouped words with word count
                for (var date in groupedWords) {
                    var dateHeader = document.createElement('li');
                    dateHeader.textContent = `${date} (${groupedWords[date].length} words)`;
                    dateHeader.className = 'date-header';
                    wordList.appendChild(dateHeader);

                    groupedWords[date].forEach(function (word) {
                        var li = document.createElement('li');
                        var wordText = document.createElement('span');
                        wordText.className = 'word-text';
                        wordText.textContent = word;
                        // Add a delete button for each word
                        var deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.addEventListener('click', function () {
                            deleteWord(word);
                        });
                        li.appendChild(wordText);
                        li.appendChild(deleteBtn);
                        wordList.appendChild(li);
                    });
                }
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
                    if (chrome.runtime.lastError) {
                        console.error('Error deleting word:', chrome.runtime.lastError);
                    } else {
                        console.log('Word deleted successfully: ' + wordToDelete);
                        // Update UI after deletion
                        displaySavedWords();
                    }
                });
            }
        });
    }

    // Display saved words when the popup is opened
    displaySavedWords();
});
