const playButtonRef = document.getElementById('timerToggle');
const clockRef = document.getElementById('clock');
const cockTimeRef = document.getElementById('cockTime');
const successButtonRef = document.getElementById('successButton');
const successScreenRef = document.getElementById('successScreen');
const minutesTodayRef = document.getElementById('today');
const backRef = document.getElementById('back-icon');
let timerVal = 10;
let isVideoPlaying = false;
let minutesToday = 0;
let cocktails = [
    {
        "name": "first",
        "cocktailSeconds": 300,
        "timeUntilReady": 1200
    }
]
let cocktailsIndex = 0;

playButtonRef ? (playButtonRef.onclick = function(){
    timerButton();
}):(null);

successButtonRef ? (successButtonRef.onclick = function(){
    toggleSuccess();
    setBeverage();
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
    chrome.extension.sendMessage({
        "message":"setBeverage", 
        "name": cocktails[cocktailsIndex]["name"],
        "cocktailSeconds": cocktails[cocktailsIndex]["cocktailSeconds"],
        "timeUntilReady": cocktails[cocktailsIndex]["timeUntilReady"],
    });
}

function toggleSuccess(){
    successScreenRef.classList.toggle("success-off");
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
let pauseVideo = function(){}

if(video){
    video.addEventListener('playing', (event) => {
        if(isVideoPlaying == false){
            chrome.extension.sendMessage({"message":"playingVideo"});
            isVideoPlaying = true;
        }
    });
    video.addEventListener('pause', (event) => {
        if(isVideoPlaying == true){
            chrome.extension.sendMessage({"message":"pauseVideo"});
            isVideoPlaying = false;
        }
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
        item.style.visibility = "hidden";
    })
}

function showElementsWhenTimerOff(){
    let selector = document.querySelectorAll(".hide-on-timer");
    selector.forEach(item=>{
        item.style.visibility = "visible";
    })
}

setBeverage();
getCurrentTime();
getCockTime();
getMinutesToday();
displayMinutesToday();
