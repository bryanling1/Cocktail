chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get("coctailSeconds", function(data){
        if(data["coctailSeconds"] == undefined){
            chrome.storage.sync.set(
                {
                cocktailsMade: 0,
            }
            );
        }
    })
})

let timerInterval = null;
let cockTimerInterval = null;
let timerVal = null;
let cockTimerVal = null;
let isTimerOn = false;
let cockReward = null;


chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if(req.message == "timerButton"){
        if(isTimerOn == true){
            isTimerOn = false;
            stopClock(timerInterval);
        }else{
            timerVal = timerVal;
            isTimerOn = true;
            timerInterval = setInterval(clockDown, 1000);
        }
    }else if(req.message == "showTime"){
        sendClockVal(timerVal);
    }else if(req.message == "getCockTime"){
        chrome.storage.sync.get("cocktailSeconds", function(data){
            chrome.extension.sendMessage({"message": "displayCocktailTime", "data": data["cocktailSeconds"]})
        });
    }else if (req.message == "playingVideo"){
        chrome.storage.sync.get("cocktailSeconds", function(data){
            cockTimerVal = data["cocktailSeconds"];
            cockTimerInterval = setInterval(cockClockDown, 1000);
        });
    }else if (req.message == "pauseVideo"){
        if(cockTimerVal){
            setCockTimerVal(cockTimerVal);
            stopCockClock();
        }
    }
    else if (req.message == "setBeverage"){
        cockReward  = req.cocktailSeconds;
        timerVal = req.timeUntilReady;
        sendClockVal(timerVal);
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

function stopCockClock(){
    clearInterval(cockTimerInterval);
}

function cockClockDown(){
    if(cockTimerVal <= 0){
        stopCockClock();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"message": "noCockTime"});
          });
    }else{
        cockTimerVal -= 1;
        sendCockClockVal(cockTimerVal);
        setCockTimerVal(cockTimerVal);
    }
    
}

function setCockTimerVal(val){
    chrome.storage.sync.set({
        cocktailSeconds: val
    })
}

function sendClockVal(val){
    chrome.extension.sendMessage({"message": "startTimer", "time": val});
}

function sendCockClockVal(val){
    chrome.extension.sendMessage({"message": "getCockClockVal", "data": val});
}

function success(){
    chrome.storage.sync.get("cocktailSeconds", function(data){
        chrome.storage.sync.set(
            {cocktailSeconds: data["cocktailSeconds"] + cockReward,
        });
        chrome.extension.sendMessage({"message": "displayCocktailTime", "data": data["cocktailSeconds"] +  cockReward})
        chrome.extension.sendMessage({"message": "success"})
        isTimerOn = false;

    });
}









