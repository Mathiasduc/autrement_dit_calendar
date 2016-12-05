var app = {
	init: function(){
		console.log("dans init");
		console.log(chrome.runtime);
		/*test d envoi et de reception de message entre pop et view */
		chrome.runtime.onMessage.addListener(
			function(request, sender, sendResponse) {
				console.log(sender.tab ?
					"from a content script:" + sender.tab.url :
					"from the extension");
				if (request.greeting == "hello")
					sendResponse({farewell: "goodbye"});
			});
		
		chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
			console.log(response.farewell);
		});

	}
}
console.log("dans contentscript");
$(document).ready(function(){
	app.init();
});