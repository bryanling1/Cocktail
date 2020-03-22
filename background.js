chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set(
        {timerSeconds: 1200,
        cocktailSeconds: 0,
        cocktailsMade: 0,
    }
    );
})

let timerInterval = null;
let timerVal = null;
let initTimerVal = 120;
let isTimerOn = false;

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if(req.message == "timerButton"){
        if(isTimerOn == true){
            isTimerOn = false;
            stopClock(timerInterval);
        }else{
            initTimerVal = req.time;
            timerVal = timerVal?(timerVal):(initTimerVal);
            isTimerOn = true;
            timerInterval = setInterval(clockDown, 1000);
        }
    }else if(req.message == "showTime"){
        sendClockVal(timerVal?(timerVal):(initTimerVal));
    }else if(req.message == "getCockTime"){
        chrome.storage.sync.get("cocktailSeconds", function(data){
            chrome.extension.sendMessage({"message": "displayCocktailTime", "data": data["cocktailSeconds"]})
        });
    }
})

function stopClock(){
    clearInterval(timerInterval);
}

function clockDown(){
    if(timerVal <= 1){
        stopClock();
        success();
    }
    timerVal -= 1;
    sendClockVal(timerVal);
}

function sendClockVal(val){
    chrome.extension.sendMessage({"message": "startTimer", "time": val});
}

function success(){
    chrome.storage.sync.get("cocktailSeconds", function(data){
        chrome.storage.sync.set(
            {cocktailSeconds: data["cocktailSeconds"] + initTimerVal,
        });
        chrome.extension.sendMessage({"message": "displayCocktailTime", "data": data["cocktailSeconds"] + initTimerVal})
    });
}










