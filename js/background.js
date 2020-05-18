let timerInterval = null;
let cockTimerInterval = null;
let timerVal = null;
let initTimerVal = null;
let cockTimerVal = null;
let isTimerOn = false;
let cockReward = null;
let beverageSet = false;
let isTimerExist = false;
let isCocktailTimerOn = false;
let isHardcoreModeOn = false;

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
        isCocktailTimerOn = false;
        pushEmptyNotification()
        if(isHardcoreModeOn && beverageSet){
            startTimer()
        }
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
    chrome.extension.sendMessage({"message": "getTimerTick", "time": val});
}


function sendCockClockVal(val){
    chrome.extension.sendMessage({"message": "getCockClockVal", "data": val});
}


function timerIsOn(){
    chrome.extension.sendMessage({"message": "timerIsOn"});
}


function timerIsOff(){
    chrome.extension.sendMessage({"message": "timerIsOff"});
}


function success(){
    chrome.storage.sync.get(["cocktailSeconds", 'cocktailSet','cocktails', 'cash'], function(data){
        const name = data['cocktailSet'];
        const cash = data['cash'];
        let cocktails = data["cocktails"];
        cocktails[name]["uses"] = cocktails[name]["uses"] + 1;
        chrome.storage.sync.set({
            cocktailSeconds: data["cocktailSeconds"] + cockReward,
            cocktails: cocktails,
            cash: cash + cocktails[name]["cashPrize"]
        });
        chrome.extension.sendMessage({"message": "displayCocktailTime", "data": data["cocktailSeconds"] +  cockReward})
        chrome.extension.sendMessage({"message": "success", "time": initTimerVal})
        isTimerOn = false;
        beverageSet = false;
        isTimerExist = false;
        pushSuccessNotification();
        saveSeconds(initTimerVal);
        if(isHardcoreModeOn){
            initCocktailTimer()
        }
    });
}

function setCocktailSeconds(seconds){
    chrome.storage.sync.set({
        cocktailSeconds: seconds,
    });
}


function pushSuccessNotification() {
    hardCoreMessage = ""
    if(isHardcoreModeOn){
        hardCoreMessage = "Break timer started!"
    }
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
          "body": "Enjoy! " +  hardCoreMessage
      }
       );
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            var notification = new Notification(
                "Your Cocktail is Ready!", 
            {
                "icon": "./images/default.png",
                "body": "Enjoy! " +  hardCoreMessage
            }
             );
        }
      });
    }
    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}

function pushEmptyNotification(){
    hardCoreMessage = ""
    if(isHardcoreModeOn){
        hardCoreMessage = "Timer just started!"
    }
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification("You're out of cocktails!", 
      {
          "icon": "./images/default.png",
          "body": "Get back on it! "+ hardCoreMessage
      }
       );
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
            var notification = new Notification("You're out of cocktails!", 
            {
                "icon": "./images/default.png",
                "body": "Get back on it! " + hardCoreMessage
            }
            );
        }
      });
    }
    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
  }

  
function saveSeconds(seconds){
    minutes = Math.floor(seconds / 60);
    let date = new Date().toDateString();
    let date2 = date.split(" ")[1]+date.split(" ")[3];
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
        //for the whole month
        if(date2 in allData){
            allData[date2] += minutes;
        }else{
            allData[date2] = minutes;
        }
        chrome.storage.sync.set({'allData': allData});
    })
}

function saveSecondsAtDate(seconds, dateString){
    minutes = Math.floor(seconds / 60);
    let date = new Date(dateString).toDateString();
    let date2 = date.split(" ")[1]+date.split(" ")[3];
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
        //for the whole month
        if(date2 in allData){
            allData[date2] += minutes;
        }else{
            allData[date2] = minutes;
        }
        chrome.storage.sync.set({'allData': allData});
    })
}

function setSecondsAtDate(seconds, dateString){
    minutes = Math.floor(seconds / 60);
    let date = new Date(dateString).toDateString();
    let date2 = date.split(" ")[1]+date.split(" ")[3];
    let allData = {};
    chrome.storage.sync.get("allData", function(data){
        if(data){
            allData = data["allData"];
        }
        
        allData[date] = minutes;
        //month data does not change
        chrome.storage.sync.set({'allData': allData});
    })
}


function addBeverage(name, cocktailSeconds, timeUntilReady, cashPrize){
    let cocktails = {};
    chrome.storage.sync.get("cocktails", function(data){
    if(data["cocktails"]){
        cocktails = data["cocktails"];
    }
    cocktails[name] = {};
    cocktails[name]["cocktailSeconds"] = cocktailSeconds;
    cocktails[name]["timeUntilReady"] = timeUntilReady;
    cocktails[name]["cashPrize"] = cashPrize;
    cocktails[name]["tier"] = 1;
    cocktails[name]["uses"] = 0;
    
    chrome.storage.sync.set({"cocktails":cocktails})
    })
}

function initCocktailTimer(){
    if(isTimerExist == false){
        chrome.storage.sync.get("cocktailSeconds", function(data){
            cockTimerVal = data["cocktailSeconds"];
            cockTimerInterval = setInterval(cockClockDown, 1000);
            isCocktailTimerOn = true;
        });
    }
}

function startTimer(){
    isTimerOn = true;
    timerIsOn()
    timerInterval = setInterval(clockDown, 1000);
    if (isTimerExist == false){
        isTimerExist = true;
    }
    chrome.extension.sendMessage({"message": "blocknav"})
    //pause the cocktai timer if its on
    if(cockTimerVal && isCocktailTimerOn){
        setCockTimerVal(cockTimerVal);
        stopCockClock();
        isCocktailTimerOn = false;
    }
    //make sure we the cocktail is stopped
    pauseCocktailTimer()
}

function pauseCocktailTimer(){
    if(cockTimerVal && isCocktailTimerOn){
        setCockTimerVal(cockTimerVal);
        stopCockClock();
        isCocktailTimerOn = false;
    }
}

//listeners
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get("cocktailSeconds", function(data){
        if(data["cocktailSeconds"] == undefined){
            chrome.storage.sync.set(
                {
                cocktailsMade: 0,
                allData: {},
                cocktailSeconds: 0,
                cocktails: {
                    "test":{
                        "cocktailSeconds": 10,
                        "timeUntilReady": 10,
                        "cashPrize": 10,
                        "tier": 1,
                        "uses": 0
                    },
                    "shotgun":{
                        "cocktailSeconds": 300,
                        "timeUntilReady": 1200,
                        "cashPrize": 20,
                        "tier": 1,
                        "uses": 0
                    },
                },
                cocktailSet: "test",
                cash: 0
            }
            );
        }
    })
})


chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if(req.message == "timerButton"){
        if(isTimerOn == true){
            isTimerOn = false;
            timerIsOff()
            stopClock(timerInterval);
        }else{
            startTimer()
        }
    }else if(req.message == "showTime"){
        sendClockVal(timerVal);
    }else if(req.message == "getCockTime"){
        chrome.storage.sync.get("cocktailSeconds", function(data){
            chrome.extension.sendMessage({"message": "displayCocktailTime", "data": data["cocktailSeconds"]})
        });
    }else if (req.message == "playingVideo"){
        if(!isCocktailTimerOn){
            initCocktailTimer()
        }
        
    }else if (req.message == "pauseVideo"){
        if(cockTimerVal && isCocktailTimerOn){
            setCockTimerVal(cockTimerVal);
            stopCockClock();
            isCocktailTimerOn = false;
        }
    }else if(req.message == "cockButton"){
        if(isCocktailTimerOn){
            isCocktailTimerOn = false;
            setCockTimerVal(cockTimerVal);
            stopCockClock();
            isCocktailTimerOn = false;
        }else{
            initCocktailTimer()
        }
    }
    else if (req.message == "setBeverage"){
        if((isTimerOn == false && timerVal == initTimerVal) || timerVal == 0){
            cockReward  = req.cocktailSeconds;
            timerVal = req.timeUntilReady;
            initTimerVal = req.timeUntilReady;
            sendClockVal(timerVal);
            beverageSet = true;
        }
        
    }
    else if (req.message == "isTimerOn"){
         sendResponse({"message": isTimerOn })
        // sendResponse({"message": (isTimerOn || (timerVal != initTimerVal) ? (true):(false))})
    }
    else if (req.message == "isTimerExist"){
        sendResponse({"message": isTimerExist})
    }
    else if (req.message == "isHardcoreOn"){
        sendResponse({"message": isHardcoreModeOn})
    }
    else if (req.message == "hardcoreButton"){
        isHardcoreModeOn = !isHardcoreModeOn
        sendResponse({"message": isHardcoreModeOn})
        if(isHardcoreModeOn){
            initCocktailTimer()
        }
    }
})
