const playButtonRef = document.getElementById('timerToggle');
const clockRef = document.getElementById('clock');
const cockTimeRef = document.getElementById('cockTime');
const successButtonRef = document.getElementById('successButton');
const successScreenRef = document.getElementById('successScreen');
let timerInterval = null;
let timerVal = 10;
let isVideoPlaying = false;
let cocktails = [
    {
        "name": "first",
        "cocktailSeconds": 0,
        "timeUntilReady": 5
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
    if(req.message == "startTimer"){
        displayTime(req.time);
    }else if(req.message == "displayCocktailTime"){
        displayCockTime(req.data);
    }else if (req.message == "getCockClockVal"){
        displayCockTime(req.data);
    }else if (req.message == "noCockTime"){
        pauseVideo();
    }else if (req.message == "success"){
        toggleSuccess();
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

setBeverage();
getCurrentTime();
getCockTime();
