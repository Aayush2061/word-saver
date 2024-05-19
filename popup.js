document.addEventListener('DOMContentLoaded', function () {
    function displaySavedWords() {
        chrome.storage.sync.get('words', function (data) {
            var words = data.words || [];
            var wordList = document.getElementById('wordList');
            wordList.innerHTML = '';

            if (words.length === 0) {
                var li = document.createElement('li');
                li.className = 'no-words';
                li.textContent = 'No words saved.';
                wordList.appendChild(li);
            } else {
                var groupedWords = words.reduce((acc, entry) => {
                    var date = new Date(entry.timestamp).toLocaleDateString();
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(entry);
                    return acc;
                }, {});

                var today = new Date().toLocaleDateString();

                for (var date in groupedWords) {
                    var dateHeader = document.createElement('li');
                    dateHeader.textContent = `${date} (${groupedWords[date].length} words)`;
                    dateHeader.className = 'date-header';
                    dateHeader.dataset.date = date;
                    dateHeader.addEventListener('click', function () {
                        toggleWordsVisibility(this.dataset.date);
                    });
                    wordList.appendChild(dateHeader);

                    var wordItemsContainer = document.createElement('ul');
                    wordItemsContainer.className = `word-items`;
                    wordItemsContainer.dataset.date = date;
                    wordItemsContainer.style.display = date === today ? 'block' : 'none';
                    groupedWords[date].forEach(function (entry) {
                        var li = document.createElement('li');
                        li.className = 'word-item';
                        var wordText = document.createElement('span');
                        wordText.className = 'word-text';
                        wordText.textContent = entry.word;

                        var buttonsContainer = document.createElement('div');
                        buttonsContainer.className = 'buttons-container';

                        var pronounceBtn = document.createElement('button');
                        pronounceBtn.textContent = '🔊';
                        pronounceBtn.className = 'pronounce-btn';
                        pronounceBtn.addEventListener('click', function () {
                            pronounceWord(entry.word);
                        });

                        var deleteBtn = document.createElement('button');
                        deleteBtn.textContent = 'Delete';
                        deleteBtn.addEventListener('click', function () {
                            deleteWord(entry.word);
                        });

                        buttonsContainer.appendChild(pronounceBtn);
                        buttonsContainer.appendChild(deleteBtn);

                        li.appendChild(wordText);
                        li.appendChild(buttonsContainer);
                        wordItemsContainer.appendChild(li);
                    });

                    wordList.appendChild(wordItemsContainer);
                }
            }
        });
    }

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
                        displaySavedWords();
                        updateHighlights();
                    }
                });
            }
        });
    }

    function downloadPDF() {
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF();
        chrome.storage.sync.get('words', function (data) {
            var words = data.words || [];
            if (words.length === 0) {
                doc.text('No words saved.', 10, 10);
            } else {
                var groupedWords = words.reduce((acc, entry) => {
                    var date = new Date(entry.timestamp).toLocaleDateString();
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(entry.word);
                    return acc;
                }, {});

                var y = 10;
                for (var date in groupedWords) {
                    doc.text(`${date} (${groupedWords[date].length} words)`, 10, y);
                    y += 10;
                    groupedWords[date].forEach(function (word) {
                        doc.text(word, 10, y);
                        y += 10;
                    });
                    y += 10;
                }
            }
            doc.save('saved_words.pdf');
        });
    }

    function updateHighlights() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'updateHighlights' });
        });
    }

    function pronounceWord(word) {
        var utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
    }

    function toggleWordsVisibility(date) {
        var wordItemsContainer = document.querySelector(`.word-items[data-date="${date}"]`);
        if (wordItemsContainer) {
            wordItemsContainer.style.display = wordItemsContainer.style.display === 'none' ? 'block' : 'none';
        }
    }

    document.getElementById('downloadPDFButton').addEventListener('click', downloadPDF);
    displaySavedWords();
});
