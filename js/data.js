
document.addEventListener('DOMContentLoaded', (event) => {
//menus
const statsRef = document.getElementById('stats');
const homeRef = document.getElementById('home');
const barRef = document.getElementById('bar');

const statsToggleRef = document.getElementById('stats-icon');
const dataDateRef = document.getElementById('data-date');
const leftArrowRef = document.getElementById('left-arrow');
const rightArrowRef = document.getElementById('right-arrow');
const leftArrowMonthRef = document.getElementById('left-arrow-month');
const rightArrowMonthRef = document.getElementById('right-arrow-month');
const yearIconRef =  document.getElementById('year-icon');
const monthIconRef =  document.getElementById('month-icon');
const weekIconRef =  document.getElementById('week-icon');
const yearRef =  document.querySelector('.stats-year');
const monthRef =  document.querySelector('.stats-month');
const weekRef =  document.querySelector('.stats-week');
const statsMenuRef =  document.getElementById('stats-menu-icon');
const homeMenuRef =  document.getElementById('home-menu-icon');
const barMenuRef =  document.getElementById('bar-menu-icon');
const menuSelectorRef =  document.getElementById('selector');

let weekData = [{}, {}, {}, {}, {}, {}, {}]
let monthData = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
let dateIRange = new Date;
let dateIRangeMonth = new Date;

statsToggleRef ? (statsToggleRef.onclick = function(){
    toggleStats();
}):(null);


leftArrowRef.onclick = function(){
    leftArrowClick();
}

rightArrowRef.onclick = function(){
    rightArrowClick();
}

leftArrowMonthRef.onclick = function(){
    leftArrowMonthClick();
}

rightArrowMonthRef.onclick = function(){
    rightArrowMonthClick();
}

homeMenuRef.onclick = function(){
    menuSelectorRef.style.left = '132px';
    statsRef.style.display = "none";
    homeRef.style.display = "block";
    barRef.style.display = "none";
}
statsMenuRef.onclick = function(){
    menuSelectorRef.style.left = '33px';
    statsRef.style.display = "block";
    homeRef.style.display = "none";
    barRef.style.display = "none";
}
barMenuRef.onclick = function(){
    menuSelectorRef.style.left = '232px';
    statsRef.style.display = "none";
    homeRef.style.display = "none";
    barRef.style.display = "block";
}

monthIconRef.onclick=function(){
    yearRef.classList.add("hide-stats-type");
    monthRef.classList.remove("hide-stats-type");
    weekRef.classList.add("hide-stats-type");

    yearIconRef.classList.remove("selected-data-mode");
    monthIconRef.classList.add("selected-data-mode");
    weekIconRef.classList.remove("selected-data-mode");
}

yearIconRef.onclick=function(){
    yearRef.classList.remove("hide-stats-type");
    monthRef.classList.add("hide-stats-type");
    weekRef.classList.add("hide-stats-type");

    yearIconRef.classList.add("selected-data-mode");
    monthIconRef.classList.remove("selected-data-mode");
    weekIconRef.classList.remove("selected-data-mode");
}

weekIconRef.onclick=function(){
    yearRef.classList.add("hide-stats-type");
    monthRef.classList.add("hide-stats-type");
    weekRef.classList.remove("hide-stats-type");

    yearIconRef.classList.remove("selected-data-mode");
    monthIconRef.classList.remove("selected-data-mode");
    weekIconRef.classList.add("selected-data-mode");
}

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


function getDaysInMonth(year, month){
    return new Date(year, month, 0).getDate();
}

function setCurrentMonthDates(){
    let date = new Date(dateIRangeMonth.getFullYear(), dateIRangeMonth.getMonth());
    let days = getDaysInMonth(dateIRangeMonth.getFullYear(), dateIRangeMonth.getMonth() + 1);
    for(let i=0; i<days; i++){
        let date2 = new Date(date.getTime() + i*24*3600*1000);
        monthData[i]["date"] = date2
    }
}

function setMonthVals(){
    let largestVal = 0;
    let allData = null;
    chrome.storage.sync.get("allData", function(data){
        if(data){
            allData = data['allData'];
            const days =getDaysInMonth(dateIRangeMonth.getFullYear(), dateIRangeMonth.getMonth() + 1);
            //get the largest value as reference
            for(let i=0; i<days; i++){
                let date = monthData[i]["date"].toDateString();
                //set minute value
                monthData[i]["minutes"] = allData[date] ? (allData[date]):(0);
                if(allData[date] > largestVal){
                    largestVal = allData[date];
                }
            }
            if(largestVal == 0){
                largestVal = 1000000;
            }
            //display
            
            const monthChartRef = document.querySelectorAll(".month .bars .column .val");
            monthChartRef.forEach((item, i)=>{
                if(i < days){
                item.style.height = Math.floor(monthData[i]['minutes'] / largestVal * 100).toString()+"%";
                if(monthData[i]['minutes'] > 0 && monthData[i]['minutes']  == largestVal){
                    item.querySelector(".text").innerHTML = monthData[i]['minutes'];
                }else{
                    item.querySelector(".text").innerHTML = "";
                }
                }
            })

            
        }
    })
}

function displayMonthRange(){
    const DateMonthRef = document.getElementById("data-date-month");
    DateMonthRef.innerHTML = dateIRangeMonth.toDateString().split(" ")[1] + " " +dateIRangeMonth.toDateString().split(" ")[3];
}

function setArrowColorsMonth(){
    let days = getDaysInMonth(dateIRangeMonth.getFullYear(), dateIRangeMonth.getMonth() + 1);
    if(new Date().getTime() - dateIRangeMonth.getTime() <= 24*3600*1000 * days){
        rightArrowMonthRef.classList.add("disabled-arrow")
    }else{
        rightArrowMonthRef.classList.remove("disabled-arrow")
    }
}

function leftArrowMonthClick(){
    let days = getDaysInMonth(dateIRangeMonth.getFullYear(), dateIRangeMonth.getMonth());
    dateIRangeMonth = new Date(dateIRangeMonth.getTime() - 24*3600*1000*days);
    setCurrentMonthDates()
    setMonthVals()
    displayMonthRange()
    setArrowColorsMonth()
   
}

function rightArrowMonthClick(){
    let days = getDaysInMonth(dateIRangeMonth.getFullYear(), dateIRangeMonth.getMonth() + 1);
    if(new Date().getTime() - dateIRangeMonth.getTime() > 24*3600*1000*days){
        dateIRangeMonth = new Date(dateIRangeMonth.getTime() + 24*3600*1000*days);
        setCurrentMonthDates()
        setMonthVals()
        displayMonthRange()
        setArrowColorsMonth()
    }
}

setCurrentWeekDates(dateIRange);
setWeekVals();
displayDateRange();
setArrowColors();
setCurrentMonthDates()
setMonthVals()
displayMonthRange()
setArrowColorsMonth()


})