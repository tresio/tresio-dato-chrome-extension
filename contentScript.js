(function(){

  var style = document.createElement('style');
  style.innerHTML =
    '#field--sitemap {' +
      'max-height: 600px;' +
      'overflow: hidden;' +
    '}' +
    '#field--htaccess {' +
      'max-height: 600px;' +
      'overflow: hidden;' +
    '}' +
    '[class*=tresio-counter] {' +
      'background-color: #ffffff;' +
      'border-radius: 100%;' +
      'height: 26px;' +
      'width: 26px;' +
      'line-height: 27px;' +
      'display: inline-block;' +
      'border: 1px solid #cacaca;' +
      'text-align: center;' +
      'font-size: 11px;' +
      'position: absolute;' +
      'top: 7px;' +
    '}' +
    '.tresio-counter-o {' +
       'right: 32px;' +
    '}' +
    '.tresio-counter-n {' +
       'left: -36px;' +
    '}';

  var ref = document.querySelector('script');
  ref.parentNode.insertBefore(style, ref);

  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'xhr_complete') {
      let parent = document.getElementsByClassName("RichContent__content");
      let children = [];
      if(parent.length){
        children = parent[0].getElementsByClassName("RichContentItem");
        if(children !== undefined){
          for(let i = 1; i < children.length + 1; i++){

            var child = children[i - 1];
            var classNames = ["tresio-counter-o", "tresio-counter-n"];
            for (let x = 0; x < classNames.length; x++){
              if(child.getElementsByClassName(classNames[x]).length){
                if(classNames[x] !== "tresio-counter-o") {
                  child.getElementsByClassName(classNames[x])[0].innerHTML = i
                }
              } else {
                var node = document.createElement("SPAN");
                var textnode = document.createTextNode(i);
                node.classList.add(classNames[x]);
                node.appendChild(textnode);
                child.appendChild(node);
              }
            }
          }
        }
      }
      sendResponse(children);
    }
  });

})();
