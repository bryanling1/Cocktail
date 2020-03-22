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
        "cocktailSeconds": 300,
        "timeUntilReady": 10
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
        alert("You're out of drinks!")
    }
}

setBeverage();
getCurrentTime();
getCockTime();





