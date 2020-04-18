const totalCashRef = document.querySelector(".cash-text")
const cocktailsRef = document.querySelector(".store-container")
const cardsRef = document.getElementsByClassName("store-card")

function displayCash(){
    chrome.storage.sync.get('cash', function(data){
        const cash = data["cash"]
        totalCashRef.innerHTML = cash;
    })
}


function displayStoreCocktailItems(){
    chrome.storage.sync.get(['cocktails', 'cocktailSet'], function(data){
        const cocktails = data["cocktails"]
        const cocktailSet = data["cocktailSet"]
        cocktailsRef.innerHTML = `<div class="store-container-block"></div>`;
        for(let [key, value] of Object.entries(cocktails)){
            const color = getLevelColor(value['uses']*value["timeUntilReady"]);
            const progress = getLevelProgress(value['uses']*value["timeUntilReady"]);
            cocktailsRef.innerHTML += `
            <div id="${key}-card" class="store-card">
            <div class="store-card-stats-grid">
              <svg id="store-card-cocktail" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86.07 86.07">
                <title>Cocktail</title>
                <g>
                  <polygon points="28.17 30.25 56.59 30.25 57.37 29.32 60.06 26.16 24.7 26.16 28.17 30.25" style="fill: ${color}"/>
                  <path d="M787.45,743.51a43,43,0,1,0,43,43A43,43,0,0,0,787.45,743.51Zm23.18,23.31L804,774.68h0l-6.87,8.09-8.87,10.44v18l9.61,5.15H775.76l9.61-5.15v-18L763,766.82h37.55l9.3-10.44,2.13,1.89-7.61,8.54h6.31Z" transform="translate(-744.41 -743.51)" style="fill: ${color}"/>
                </g>
              </svg>
              <svg id="store-card-timer" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86.07 86.07">
                <defs>
                  <style>
                    .cls-1-${key}{
                      fill:${color};
                    }
                  </style>
                </defs>
                <title>Cocktail</title>
                <path class="cls-1-${key}" d="M911.24,743.51a43,43,0,1,0,43,43A43,43,0,0,0,911.24,743.51Zm0,38.47a4.38,4.38,0,1,1-4.38,4.38s0-.05,0-0.08l-0.08.08-7.33-11.78,11.78,7.35-0.07.07h0.07Zm0,31.84a27.46,27.46,0,0,1-19.42-46.88l3.61,3.61a22.36,22.36,0,1,0,18.36-6.4v6.28h-5.1V758.89h2.55A27.46,27.46,0,0,1,911.24,813.82Z" transform="translate(-868.2 -743.51)"/>
              </svg>
              <svg id="store-card-cash" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 86.07 86.07">
                <defs>
                  <style>
                    .cls-2-${key}{
                      fill: ${color};
                    }
                  </style>
                </defs>
                <title>Cocktail</title>
                <path class="cls-2-${key}" d="M1037.78,743.51a43,43,0,1,0,43,43A43,43,0,0,0,1037.78,743.51ZM1052,806.74a16.38,16.38,0,0,1-9.59,4.72,0.47,0.47,0,0,0-.36.43l0.07,4.65a0.86,0.86,0,0,1-.86.86h-7.16a0.86,0.86,0,0,1-.86-0.86l0.07-4.72a0.47,0.47,0,0,0-.36-0.43,17,17,0,0,1-9.55-5,13.55,13.55,0,0,1-3.47-9.52v-1.57a0.86,0.86,0,0,1,.86-0.86h7.73a0.85,0.85,0,0,1,.86.86v1.07a5.94,5.94,0,0,0,2.5,4.83,10.84,10.84,0,0,0,6.87,2q3.65,0,5.4-1.61a5.18,5.18,0,0,0,1.75-4,4.15,4.15,0,0,0-1.07-2.9,9.36,9.36,0,0,0-3-2.08q-1.9-.89-6-2.47a54.17,54.17,0,0,1-7.8-3.36,16.14,16.14,0,0,1-5.33-4.69,12,12,0,0,1-2.18-7.34,13,13,0,0,1,3.33-9.12,15.81,15.81,0,0,1,9-4.69,0.47,0.47,0,0,0,.36-0.43l-0.14-5.22a0.85,0.85,0,0,1,.86-0.86h7.16a0.85,0.85,0,0,1,.86.86l-0.07,5.37a0.47,0.47,0,0,0,.36.43,16.63,16.63,0,0,1,9.45,5.19,14.14,14.14,0,0,1,3.51,9.7V777a0.85,0.85,0,0,1-.86.86h-7.8a0.86,0.86,0,0,1-.86-0.86v-0.57a6.62,6.62,0,0,0-2.36-5.12,9.32,9.32,0,0,0-6.44-2.11,7.83,7.83,0,0,0-5,1.43,4.76,4.76,0,0,0-1.79,3.94,4.47,4.47,0,0,0,1,3,9.38,9.38,0,0,0,3.11,2.22q2.08,1,6.44,2.58a74.11,74.11,0,0,1,7.59,3.22,15.11,15.11,0,0,1,5,4.29,11.69,11.69,0,0,1,2.22,7.37A13.22,13.22,0,0,1,1052,806.74Z" transform="translate(-994.75 -743.51)"/>
              </svg>
              <div id="cocktail-text-card">${Math.floor(value['cocktailSeconds'] / 60)}</div>
              <div id="cash-text-card">${value['cashPrize']}</div>
              <div id="timer-text-card">${Math.floor(value['timeUntilReady'] / 60)}</div>
            </div>
            <div class="card-cocktail-preview" style="background-image:url('./images/cocktails/${key+"-tier"+value["tier"]}.png')"></div>
            <svg
            viewBox="0 0 100 50"
            class="card-progress"
          ><g
            fill-opacity="0"
            stroke-width="8"
          ><path
            d="M5 50a45 45 0 1 1 90 0"
            stroke="#EBEDF8"
          /><path
            id="${key}"
            class="progress-store"
            d="M5 50a45 45 0 1 1 90 0"
            stroke="${color}"
            stroke-dasharray="142"
            stroke-dashoffset="142"
          /></g></svg>
          <div class="store-card-progress-text">${Math.floor(value['uses'] * value['timeUntilReady'] / 60)}</div>
          </div>
          <style>
                #${key}{
                    --percent: ${progress};
                }
                #${key}-card{
                    box-shadow: 3.3px 3.3px ${key === cocktailSet ? (color):("#d8d8d8")};
                }
          </style>
            `; 
        }
        for(let [key, value] of Object.entries(cocktails)){
            document.getElementById(`${key}-card`).onclick = function(){
                setTheBeverage(`${key}`);
                    }
        }

    })
}


function setTheBeverage(beverage){
    chrome.storage.sync.set({cocktailSet: beverage}, function(){
        displayStoreCocktailItems();
        setBeverage()
    })
    
}

displayCash();
displayStoreCocktailItems();