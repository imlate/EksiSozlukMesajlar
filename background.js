var delay = 1;

chrome.browserAction.onClicked.addListener(goToPage);
chrome.runtime.onInstalled.addListener(startRequest);
chrome.alarms.onAlarm.addListener(startRequest);

function goToPage() {
  checkMessages();
  if(localStorage.thereIsMessage == "notLoggedIn") {
	console.log('Going to login page...');
	chrome.tabs.create({url: getEksiSozlukLoginUrl()});
  } else {
    console.log('Going to inbox...');
	chrome.tabs.create({url: getEksiSozlukMesajlarUrl()});
  }
}

function getEksiSozlukMesajlarUrl() {
  return "https://eksisozluk.com/mesaj/";
}

function getEksiSozlukLoginUrl() {
  return "https://eksisozluk.com/giris";
}

function getEksiSozlukCheckUrl() {
  return "https://eksisozluk.com/istatistik";
}

function startRequest() {
  console.log('startRequest');
  scheduleRequest();
  checkMessages();
}

function checkMessages() {
  console.log('Checking messages');
  var eksiSozlukSite = new XMLHttpRequest();
  eksiSozlukSite.open("GET", getEksiSozlukCheckUrl(), false);
  eksiSozlukSite.onreadystatechange = function() {
	if(eksiSozlukSite.readyState == 4) {
	 var xmlDoc = eksiSozlukSite.responseText;
	 if(xmlDoc.search("top-login-link") > -1) {
	 	console.log("Not logged in");
		localStorage.thereIsMessage = "notLoggedIn";
	  } else if(xmlDoc.search('<a class="new-update" href="/mesaj">mesaj</a>') > -1) {
		console.log('There happens to be at least a message');
		localStorage.thereIsMessage = "true";
	  } else {
		console.log('There is no message');
		localStorage.thereIsMessage = "false";
	  }
	  updateIcon();
	}
  }
  eksiSozlukSite.send(null);
}

function updateIcon () {
  if(localStorage.thereIsMessage == "notLoggedIn") {
	console.log('Setting icon to not logged in');
	chrome.browserAction.setIcon({path:"ilogo114.png"});
	chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
    chrome.browserAction.setBadgeText({text:"!"});
  } else if (localStorage.thereIsMessage == "true") {
	console.log('Setting icon to there is a message');
	chrome.browserAction.setIcon({path:"thereIsMessage.png"});
	chrome.browserAction.setBadgeText({text:""});
  } else if (localStorage.thereIsMessage == "false") {
    console.log('Setting icon to there is no message');
	chrome.browserAction.setIcon({path:"ilogo114.png"});
	chrome.browserAction.setBadgeText({text:""});
  }
}

function scheduleRequest() {
  console.log('Creating alarm');
  chrome.alarms.create('refresh', {periodInMinutes: delay});
}
