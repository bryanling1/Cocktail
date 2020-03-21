chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set(
        {timerSeconds: 1200,
        cocktailSeconds: 0,
        cocktailsMade: 0,
    }
    );
})

