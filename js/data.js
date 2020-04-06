const statsRef = document.getElementById('stats');
const statsToggleRef = document.getElementById('stats-icon');
const dataDateRef = document.getElementById('data-date');
const leftArrowRef = document.getElementById('left-arrow');
const rightArrowRef = document.getElementById('right-arrow');
let weekData = [{}, {}, {}, {}, {}, {}, {}]
let dateIRange = new Date;

statsToggleRef ? (statsToggleRef.onclick = function(){
    toggleStats();
}):(null);

backRef ? (backRef.onclick = function(){
    toggleStats();
}):(null);

backRef ? (leftArrowRef.onclick = function(){
    leftArrowClick();
}):(null);

backRef ? (rightArrowRef.onclick = function(){
    rightArrowClick();
}):(null);

function setCurrentWeekDates(date){
    index = date.getDay();
    //set days before
    for(let i=0;i<=index;i++){
        date2 = new Date(date.getTime() - i*24*3600*1000);
        weekData[index - i]["date"] = date2;
    }
    //set days after
    for(let i=1;i<7-index;i++){
        date2 = new Date(date.getTime() + i*24*3600*1000);
        weekData[index + i]["date"] = date2;
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
                item.style.height = Math.floor(weekData[i]['minutes'] / largestVal * 100).toString()+"%";
                if(weekData[i]['minutes'] > 0){
                    item.querySelector(".text").innerHTML = weekData[i]['minutes'];
                }else{
                    item.querySelector(".text").innerHTML = "";
                }
            })

            
        }
    })
}

function displayDateRange(){
    index = dateIRange.getDay();
    date = new Date(dateIRange.getTime() - 24*3600*1000*index);
    const startDate = date.toDateString().split(" ")[1] + " " +date.toDateString().split(" ")[2];
    date = new Date(date.getTime() + 24*3600*1000*7);
    const endDate = date.toDateString().split(" ")[1] + " " +date.toDateString().split(" ")[2];
    dataDateRef.innerHTML = startDate + " - " + endDate;
}

function setArrowColors(){
    console.log(new Date().getTime() - dateIRange.getTime())
    if(new Date().getTime() - dateIRange.getTime() <= 604800000){
        rightArrowRef.classList.add("disabled-arrow")
    }else{
        rightArrowRef.classList.remove("disabled-arrow")
    }
}

function leftArrowClick(){
    dateIRange = new Date(dateIRange.getTime() - 604800000);
    displayDateRange();
    setArrowColors();
    setCurrentWeekDates(dateIRange);
    setWeekVals();
    console.log(weekData);
}

function rightArrowClick(){
    if(new Date().getTime() - dateIRange.getTime() > 604800000){
        dateIRange = new Date(dateIRange.getTime() + 604800000);
        displayDateRange();
        setArrowColors();
        setCurrentWeekDates(dateIRange);
        setWeekVals();
    }
}



function toggleStats(){
    statsRef.classList.toggle("hideStats");
    setCurrentWeekDates(dateIRange);
    setWeekVals();
    displayDateRange();
    setArrowColors();
}


