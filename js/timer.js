const playButtonRef = document.getElementById('timerToggle');
const clockRef = document.getElementById('clock');
const cockTimeRef = document.getElementById('cockTime');
const successButtonRef = document.getElementById('successButton');
const successScreenRef = document.getElementById('successScreen');
const minutesTodayRef = document.getElementById('today');
const backRef = document.getElementById('back-icon');
const cocktailIconRef = document.getElementById('cocktail-icon-text');
const timerIconRef = document.getElementById('timer-icon-text');
const cashIconRef = document.getElementById('cash-icon-text');
const cardNameRef =  document.querySelector('.card-name');
const cardXPRef = document.getElementById('card-xp-text');
const cardProgress = document.querySelector(".progress");
const cardPlayButtonRef = document.querySelector("#card-play-button");
const cardRef = document.querySelector(".cocktail-card-wrapper");
const cardImageRef = document.querySelector(".cocktailIcon");
const menuSelectorRef =  document.getElementById('selector');
const navbarBlockerRef = document.getElementById('nav-block')
//level progress
const dataColumns = document.querySelectorAll(".bars .column .val")
let timerVal = 10;
let isVideoPlaying = false;
let minutesToday = 0;

playButtonRef ? (playButtonRef.onclick = function(){
    timerButton();
    cardRef.style.display = "none";
    minutesTodayRef.style.display = "none"
    navbarBlockerRef.style.display = "block"
}):(null);


playButtonRef ? (successButtonRef.onclick = function(){
    toggleSuccess();
    setBeverage();
}):(null);


cardPlayButtonRef ? (cardPlayButtonRef.onclick = function(){
    timerButton();
    cardRef.style.display = "none";
    minutesTodayRef.style.display = "none"
    navbarBlockerRef.style.display = "block"
}):(null);


function timerButton(){
    chrome.extension.sendMessage({"message":"timerButton", "time": timerVal});
}


function displayTime(data){
    clockRef.innerHTML = secondsToClockString(data);
}


function getCurrentTime(){
    chrome.extension.sendMessage({"message":"showTime"});
}


function displayCockTime(data){
    cockTimeRef.innerHTML = secondsToClockString(data);
}


function getCockTime(){
    chrome.extension.sendMessage({"message":"getCockTime"});
}


function setBeverage(){
    chrome.storage.sync.get(['cocktailSet','cocktails'], function(data){
        const name = data['cocktailSet']
        const cocktailSeconds =  data["cocktails"][data['cocktailSet']]["cocktailSeconds"]
        const timeUntilReady = data["cocktails"][data['cocktailSet']]["timeUntilReady"]
        const cash = data["cocktails"][data['cocktailSet']]["cashPrize"]
        const uses = data["cocktails"][data['cocktailSet']]["uses"]
        const tier = data["cocktails"][data['cocktailSet']]["tier"]

        chrome.extension.sendMessage({
            "message":"setBeverage", 
            "name": name,
            "cocktailSeconds": cocktailSeconds,
            "timeUntilReady": timeUntilReady,
        });
        cocktailIconRef.innerHTML = Math.floor(cocktailSeconds / 60);
        timerIconRef.innerHTML = Math.floor(timeUntilReady / 60);
        cashIconRef.innerHTML = cash;
        cardXPRef.innerHTML = Math.floor(uses*timeUntilReady / 60);
        cardNameRef.innerHTML = name;
        cardImageRef.style.backgroundImage = "url('./images/cocktails/"+name+"-tier"+tier+".png')"
        cardProgress.style.setProperty('--percent', getLevelProgress(uses*timeUntilReady));
        setLevelColors(getLevelColor(uses*timeUntilReady));
    })
}


function getLevelProgress(totalMinutes){
    let hours = (totalMinutes / 60 ) / 60 
    let uses = hours
    //levels are in hours
    const level1 = 1
    const level2 = 5
    const level3 = 25
    const level4 = 100
    const level5 = 500
    const level6 = 1000

    if(uses < level1){
        return uses / level1 * 100;
    }else if (uses >= level1 && uses < level1 + level2){
        return (uses - level1)  / level2 * 100;
    }
    else if (uses >= level1 + level2 && uses < level1 + level2 + level3){
        return (uses - level1 -level2)  / level3 * 100;
    }
    else if (uses >= level1 + level2 + level3 && uses < level1 + level2 + level3 + level4){
        return (uses - level1 -level2 -level3)  / level4 * 100;
    }
    else if (uses >= level1 + level2 + level3 + level4 && uses < level1 + level2 + level3 + level4 + level5){
        return (uses - level1 -level2 -level3 -level4)  / level5 * 100;
    }
    else if (level1 + level2 + level3 + level4 + level5 >= 500 && uses < level1 + level2 + level3 + level4 + level5 + level6){
        return (uses - level1 -level2 -level3 -level4 - level5)  / level6 * 100;
    }
    else if (uses >= level1 + level2 + level3 + level4 + level5 + level6){
        return 100
    }
}


function getLevelColor(totalMinutes){
    let hours = (totalMinutes / 60 ) / 60 
    let uses = hours
    //levels are in hours
    const level1 = 1
    const level2 = 5
    const level3 = 25
    const level4 = 100
    const level5 = 500
    const level6 = 1000

    if(uses < level1){
        return "#74b9ff"
    }else if (uses >= level1 && uses < level1 + level2){
        return "#0984e3"
    }
    else if (uses >= level1 + level2 && uses < level1 + level2 + level3){
        return "#6c5ce7"
    }
    else if (uses >= level1 + level2 + level3 && uses < level1 + level2 + level3 + level4){
        return "#cc2152"
    }
    else if (uses >= level1 + level2 + level3 + level4 && uses < level1 + level2 + level3 + level4 + level5){
        return "#d67047"
    }
    else if (level1 + level2 + level3 + level4 + level5 >= 500 && uses < level1 + level2 + level3 + level4 + level5 + level6){
        return "#b2c4d3"
    }
    else if (uses >= level1 + level2 + level3 + level4 + level5 + level6){
        return "#ffd00b"
    }
}


function setLevelColors(color){
    menuSelectorRef.style.backgroundColor = color;
    cardPlayButtonRef.style.backgroundColor = color;
    cardNameRef.style.color = color;
    cardProgress.style.stroke = color;
    cardXPRef.style.color = color;
    dataColumns.forEach(function(item){
        if(item.style.backgroundColor != "rgba(0, 0, 0, 0)"){
            item.style.backgroundColor = color
        }
        item.style.borderColor = color
    })

}


function toggleSuccess(){
    successScreenRef.classList.toggle("success-off");
    cardRef.style.display = "initial";
    minutesTodayRef.style.display = "block"
    navbarBlockerRef.style.display = "none"
    displayCash()
    const storeBlockerRef = document.querySelector(".store-container-block");
    storeBlockerRef.style.display = "none"
    setBeverage()
    displayStoreCocktailItems()
}


function secondsToClockString(time){
    let minutes = Math.floor(time / 60); 
    let seconds = time % 60;
    let secondsDisplay = seconds < 10?("0" + seconds):(seconds);
    return minutes + ":" +  secondsDisplay;
}


function pushEmptyNotification() {
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
          "body": "Get back on it!"
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
                "body": "Get back on it!"
            }
            );
        }
      });
    }
    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
  }


chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
    if(req.message == "getTimerTick"){
        displayTime(req.time);
        //hide the card if the timer is paused
        chrome.storage.sync.get(["cocktailSet", "cocktails"], function(data){
            const name = data["cocktailSet"]
            if(data["cocktails"][name]['timeUntilReady'] !== req.time && req.time !== 0 && req.time !== null){
                cardRef.style.display = "none";
                minutesTodayRef.style.display = "none"
            }
        })
    }else if(req.message == "displayCocktailTime"){
        displayCockTime(req.data);
    }else if (req.message == "getCockClockVal"){
        displayCockTime(req.data);
    }else if (req.message == "noCockTime"){
        pauseVideo();
    }else if (req.message == "success"){
        toggleSuccess();
        minutesToday += Math.floor(req.time/60);
        displayMinutesToday()
        showElementsWhenTimerOff()
    }else if(req.message == "timerIsOn"){
        hideElementsWhileTimerOn()
    }else if(req.message == "timerIsOff"){
        showElementsWhenTimerOff()
    }
})


const video = document.querySelector('video');

if(video){
    video.addEventListener('playing', (event) => {
        chrome.extension.sendMessage({"message":"playingVideo"});
        isVideoPlaying = true;
    });
    video.addEventListener('pause', (event) => {
        chrome.extension.sendMessage({"message":"pauseVideo"});
        isVideoPlaying = false;
    });
    pauseVideo = function(){
        video.pause();
        pushEmptyNotification();
    }
}


function getMinutesToday(){
    const date = new Date().toDateString();
    chrome.storage.sync.get("allData", function(data){
        if(date in data["allData"]){
            minutesToday = data["allData"][date]
        }
        displayMinutesToday();
    })
}


function displayMinutesToday(){
    minutesTodayRef.innerHTML = minutesToday+" mins Today"
}


function hideElementsWhileTimerOn(){
    let selector = document.querySelectorAll(".hide-on-timer");
    selector.forEach(item=>{
        item.style.display = "none";
    })
}


function showElementsWhenTimerOff(){
    let selector = document.querySelectorAll(".hide-on-timer");
    selector.forEach(item=>{
        item.style.display = "block";
    })
}


function checkClockToHideElements(){
    chrome.extension.sendMessage({"message":"isTimerOn"}, function(res){
        if(res.message){
            hideElementsWhileTimerOn()
            cardRef.style.display = "none";
            minutesTodayRef.style.display = "none"
        }
    });
    chrome.extension.sendMessage({"message":"isTimerExist"}, function(res){
        if(res.message){
            navbarBlockerRef.style.display = "block"
        }
    });
}


setBeverage();
getCurrentTime();
getCockTime();
getMinutesToday();
checkClockToHideElements();
