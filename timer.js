
const playButtonRef = document.getElementById('timerToggle');
const clockRef = document.getElementById('clock');
let timerInterval = null;
let timerVal = 10;
let isTimerOn = false;

playButtonRef.onclick = function(){
    timerButton();
}

function timerButton(){
    chrome.extension.sendMessage({"message":"timerButton", "time": timerVal});
}

function displayTime(data){
    clockRef.innerHTML = data;
}


chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
    if(req.message == "startTimer"){
        displayTime(req.time);
    }
})

