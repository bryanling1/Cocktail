const playButtonRef = document.getElementById('timerToggle');
const clockRef = document.getElementById('clock');
const cockTimeRef = document.getElementById('cockTime');
let timerInterval = null;
let timerVal = 10;
let isTimerOn = false;
let isVideoPlaying = true;

playButtonRef ? (playButtonRef.onclick = function(){
    timerButton();
}):(null);

function timerButton(){
    chrome.extension.sendMessage({"message":"timerButton", "time": timerVal});
}

function displayTime(data){
    clockRef.innerHTML = data;
}

function getCurrentTime(){
    chrome.extension.sendMessage({"message":"showTime"});
}

function displayCockTime(data){
    cockTimeRef.innerHTML = data;
}

function getCockTime(){
    chrome.extension.sendMessage({"message":"getCockTime"});
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
    }
})

getCurrentTime();
getCockTime();

const video = document.querySelector('video');
let pauseVideo = function(){}

if(video){
    video.addEventListener('play', (event) => {
        if(isTimerOn == false){
            chrome.extension.sendMessage({"message":"playingVideo"});
            isTimerOn = true;
        }
    });
    video.addEventListener('pause', (event) => {
        if(isTimerOn == true){
            chrome.extension.sendMessage({"message":"pauseVideo"});
            isTimerOn = false;
        }
    });
    pauseVideo = function(){
        video.pause();
    }
}




