'use strict';
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.toDisplay){
		displayTitle(request.toDisplay, sendResponse);
	}
	sendResponse({state:'received'});
});

function displayTitle(toDisplay, sendResponse){
	var inputQuickCreation = document.querySelector('.gcal-textinput');
	if(!inputQuickCreation){		
		console.log("ne peut pas cibler creation rapide");
	}else{
		inputQuickCreation.value = toDisplay;
	}
	var inputModify = document.querySelector('.ep-title input');
	if(!inputModify){
		console.log("ne peut pas cibler modify");
	}else{	
		inputModify.click();
		inputModify.value = toDisplay;
	}
}