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
console.log(document.querySelector('#maincell'));
var inputQuickCreation;
var	inputModify;


function displayTitle(toDisplay, sendResponse){
/*	if(!inputQuickCreation){*/
		console.log("on reasigne inputQuickCreation");
		inputQuickCreation = document.querySelector('.gcal-textinput');
	/*}*/
/*	if(!inputModify){*/
		console.log("on reasigne inputModify");
		inputModify = document.querySelector('.ep-title input');
/*	}*/
	inputQuickCreation.value = toDisplay;
	console.log(inputQuickCreation, inputModify);
}