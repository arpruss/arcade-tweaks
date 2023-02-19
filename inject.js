var body = document.getElementsByTagName('body')[0]

var mainScript = document.createElement('script')
mainScript.setAttribute('type', 'text/javascript')
mainScript.setAttribute('src', chrome.runtime.getURL('tweak.js'))
mainScript.setAttribute('id', 'arcadeTweak')
body.appendChild(mainScript)

console.log("URL",Document.URL);
