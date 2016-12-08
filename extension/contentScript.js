'use strict';
console.log("dans contentscript");
/*test d envoi et de reception de message entre popup et view */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.toDisplay){
		displayTitle(request.toDisplay, sendResponse);
	}
	console.log(request);
	sendResponse({state:'received'});
});

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	if(response){
		console.log(response);
	}
});

function displayTitle(toDisplay, sendResponse){
	console.log("in displayTitle");
	var inputQuickCreation = document.getElementsByClassName('gcal-textinput');
	var inputModify = document.getElementsByClassName('');
	console.log(input);
}