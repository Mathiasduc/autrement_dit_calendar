var app = {
	init: function(){
		/*test d envoi et de reception de message entre popup et view */
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			console.log(sender.tab ?
				"from a content script:" + sender.tab.url :
				"from the extension");
			if (request.greeting == "hello"){
				sendResponse({farewell: "goodbye from content"});
			}
		});

		chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
			console.log(response.farewell);
		});

	},
}
console.log("dans contentscript");

app.init();