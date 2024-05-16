document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('words', function (data) {
        var words = data.words || [];
        var list = document.getElementById('wordList');
        list.innerHTML = '';
        words.forEach(function (word) {
            var li = document.createElement('li');
            li.textContent = word;
            list.appendChild(li);
        });
    });
});