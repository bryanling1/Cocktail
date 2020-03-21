let button = document.getElementById("changeColor");

chrome.storage.sync.get("color", function(data){
    button.style.backgroundColor = data.color;
    button.setAttribute("value", data.color);
})

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
  };