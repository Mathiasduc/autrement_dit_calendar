var app = {
	init: function(){
		console.log("dans init options");
		this.getOptions();
		this.listeners();



	},
	getOptions: function(){
		
	},
	listeners: function(){
		$('button').on('click',saveNewOptions);
	},
	saveNewOptions: function(){
		var newType = document.getElementById('type_add').value;
		chrome.storage.sync.set({
			type: [newType];
		}, function() {
			var status = document.getElementById('status');
			status.textContent = 'Options sauvegardées.';
			setTimeout(function() {
				status.textContent = '';
			}, 750);
		});
		console.log(chrome.storage.sync.get());
	}
}
}
console.log("dans options");
$(document).ready(function(){
	app.init();
});