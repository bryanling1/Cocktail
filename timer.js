const playButtonRef = document.getElementById('timerToggle');
const clockRef = document.getElementById('clock');
const cockTimeRef = document.getElementById('cockTime');
const successButtonRef = document.getElementById('successButton');
const successScreenRef = document.getElementById('successScreen');
const minutesTodayRef = document.getElementById('today');
let timerInterval = null;
let timerVal = 10;
let isVideoPlaying = false;
let minutesToday = 0;
let cocktails = [
    {
        "name": "first",
        "cocktailSeconds": 300,
        "timeUntilReady": 60
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
        minutesToday += Math.floor(req.time/60);
        displayMinutesToday()
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
    minutesTodayRef.innerHTML = minutesToday+"mins Today"
}

setBeverage();
getCurrentTime();
getCockTime();
getMinutesToday();
displayMinutesToday();

//////////////////////////////////////For the graph///////////////////////////////////
let weekData = [{}, {}, {}, {}, {}, {}, {}]

function setCurrentWeekDates(){
    dateToday = new Date();
    index = dateToday.getDay();
    //set days before
    for(let i=0;i<=index;i++){
        date = new Date();
        dateI = date.getDay()
        date.setDate(date.getDate() - i);
        weekData[dateI - i]["date"] = date;
    }
    //set days after
    for(let i=1;i<7-index;i++){
        date = new Date();
        dateI = date.getDay()
        date.setDate(date.getDate() + i);
        weekData[dateI + i]["date"] = date;
    }
}

function setWeekVals(){
    let largestVal = 0;
    let allData = null;
    chrome.storage.sync.get("allData", function(data){
        if(data){
            allData = data['allData'];
            //get the largest value as reference
            for(let i=0; i<7; i++){
                let date = weekData[i]["date"].toDateString();
                //set minute value
                weekData[i]["minutes"] = allData[date] ? (allData[date]):(0);
                if(allData[date] > largestVal){
                    largestVal = allData[date];
                }
            }
            if(largestVal == 0){
                largestVal = 1000000;
            }
            //display
            const weekChartRef = document.querySelectorAll(".week .bars .column .val");
            weekChartRef.forEach((item, i)=>{
                console.log(weekData[i]['minutes'] / largestVal)
                item.style.height = Math.floor(weekData[i]['minutes'] / largestVal * 100).toString()+"%";
                if(weekData[i]['minutes'] > 0){
                    item.querySelector(".text").innerHTML = weekData[i]['minutes'];
                } 
            })

            
        }
    })
}

setCurrentWeekDates()
setWeekVals()



