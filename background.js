chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get("cocktailSeconds", function(data){
        if(data["cocktailSeconds"] == undefined){
            chrome.storage.sync.set(
                {
                cocktailsMade: 0,
                allData: {},
                cocktailSeconds: 0
            }
            );
        }
    })
})

let timerInterval = null;
let cockTimerInterval = null;
let timerVal = null;
let initTimerVal = null;
let cockTimerVal = null;
let isTimerOn = false;
let cockReward = null;
let beverageSet = false;


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
        if(beverageSet == false){
            cockReward  = req.cocktailSeconds;
            timerVal = req.timeUntilReady;
            initTimerVal = req.timeUntilReady;
            sendClockVal(timerVal);
            beverageSet = true;
        }
        
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
        chrome.extension.sendMessage({"message": "success", "time": initTimerVal})
        isTimerOn = false;
        beverageSet = false;
        pushSuccessNotification();
        saveMinutes(initTimerVal);

    });
}
function pushSuccessNotification() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("Your Cocktail is Ready!", 
      {
          "icon": "./images/default.png",
          "body": "Enjoy!"
      }
       );
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            var notification = new Notification("Your Cocktail is Ready!", 
            {
                "icon": "./images/default.png",
                "body": "Enjoy!"
            }
             );
        }
      });
    }
  
    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
  }

  function saveMinutes(minutes){
    minutes = Math.floor(minutes / 60);
    let date = new Date().toDateString();
    let allData = {};
    chrome.storage.sync.get("allData", function(data){
        if(data){
            allData = data["allData"];
        }
        if(date in allData){
            allData[date] += minutes;
        }else{
            allData[date] = minutes;
        }
    
        chrome.storage.sync.set({'allData': allData});
    })
    

  }







