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
let isTimerOn = false;

chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
    if(req.message == "timerButton"){
        if(isTimerOn == true){
            isTimerOn = false;
            stopClock(timerInterval);
        }else{
            timerVal = timerVal?(timerVal):(req.time);
            isTimerOn = true;
            timerInterval = setInterval(clockDown, 1000);
        }
    }
})

function stopClock(){
    clearInterval(timerInterval);
}

function clockDown(){
    sendClockVal(timerVal);
    timerVal -= 1;
}

function sendClockVal(val){
    chrome.extension.sendMessage({"message": "startTimer", "time": val});
}











