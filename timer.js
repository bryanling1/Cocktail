const playButtonRef = document.getElementById('timerToggle');
const clockRef = document.getElementById('clock');
let timerInterval = null;
let timerVal = 10;
let isTimerOn = false;

playButtonRef.onclick = function(){
    if(isTimerOn == false){
        startTimer();
    }else{
        stopTimer();
    }
    
}

function startTimer(){
    timerInterval = setInterval(clockTick, 1000)
    isTimerOn = true;
}

function clockTick(){
    timerVal -= 1;
    displayTime();
}

function stopTimer(){
    clearInterval(timerInterval);
    isTimerOn = false;
}

function displayTime(){
    clockRef.innerHTML = timerVal;
}
