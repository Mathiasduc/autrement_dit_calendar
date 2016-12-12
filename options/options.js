var app = {
	select: document.getElementById('type'),

	init: function(){
		this.populateSelect();
		this.listeners();
	},

	populateSelect: function(options){
		var me = this;
		me.select.options.length = 1;
		function populate(){
			var optionsLength = options.length;
			for (var i = 0; i < optionsLength; i++) {
				var currentOption = options[i];
				me.select.options[me.select.options.length] = new Option(currentOption, currentOption);
			}	
		}
		if(!options){
			chrome.storage.sync.get(function(result){
				options = result.type;
				populate();
			});
		}else{
			populate();
		}
	},

	listeners: function(){
		var me = this;
		document.getElementsByTagName('form')[0].addEventListener('submit', me.deleteOptions.bind(me),true);
		document.getElementsByTagName('form')[1].addEventListener('submit', me.saveNewOptions.bind(me),true);
	},

	saveNewOptions: function(event){
		event.preventDefault();
		var me = this;
		var input_add = document.getElementById('type_add');
		var newType = input_add.value;
		if(!newType){ 
			me.animationFeedback('empty');
			return(1);
		}
		newType = newType.trim().replace(/ /g,"_");
		chrome.storage.sync.get(function(result){
			result.type.push(newType);
			result.type = result.type.sort(); 
			chrome.storage.sync.set({type: result.type}, function() {
				me.animationFeedback("add");
				me.populateSelect(result.type);
			});
		});
		input_add.value = "";
	},

	deleteOptions:function(event){
		event.preventDefault();
		var me = this;
		var valueToDelete = me.select.options[me.select.selectedIndex].value;
		chrome.storage.sync.get(function(result){
			var indexToDelete = result.type.indexOf(valueToDelete);
			result.type.splice(indexToDelete, 1);
			chrome.storage.sync.set({type: result.type}, function() {
				me.animationFeedback("delete");
				me.populateSelect(result.type);
			});
		});
	},

	animationFeedback: function(typeOfMessage){
		var status = document.getElementById('status');
		var timerAnimation;
		function messageTimer(message){
			status.textContent = message;
			
			timerAnimation = setTimeout(function() {
				status.textContent = '';
			}, 4000);
		}
		clearTimeout(timerAnimation); 
		status.textContent = '';

		if (typeOfMessage === "add"){
			messageTimer('Nouveau type sauvegardé.');
		}else if (typeOfMessage === "empty"){
			messageTimer("Veuillez entrer une valeur.");	
		}else if (typeOfMessage === 'delete'){
			messageTimer("Ce type a été supprimé");
		}else if (typeOfMessage === "none"){
			messageTimer("Veuillez choisir un type.");	
		}
	}
}
document.addEventListener("DOMContentLoaded", function(event) { 
	app.init();
});