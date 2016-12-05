var app = {
	init: function(){
		console.log("dans init options");
		this.populateSelect();
		this.listeners();
	},

	populateSelect: function(){
		var select = document.getElementById('type');
		select.options.length = 1;
		chrome.storage.sync.get(function(result){
			var typeLength = result.type.length;
			for (var i = 0; i < typeLength; i++) {
				var currentOption = result.type[i];
				select.options[select.options.length] = new Option(currentOption, currentOption );
			}	
		});
	},

	listeners: function(){
		var me = this;
		document.getElementById('button_add').addEventListener("click", me.saveNewOptions.bind(me),true);
	},

	saveNewOptions: function(){
		var newType = document.getElementById('type_add').value;
		if(!newType){ 
			/*verfie que la valeur n'est pas nulle*/
			document.getElementById('type_add').setValue("Veuillez entrer une valeur.");
			return(0);
		}
		newType.replace(/ /g,"_"); /*on enleve les espaces de debut et de fin(trim) et on remplace les espaces restants avec des underscores (REGEX)*/
		console.log(newType);
		return(true);
		chrome.storage.sync.get(function(result){
			console.log(result);
			result.type.push(newType);
			chrome.storage.sync.set({type: result.type}, function() {
				this.animationFeedback("add");
				chrome.storage.sync.get(function(items){
					console.log(items);
				});
			});
		});
	},

	animationFeedback: function(addOrDelete){ 
		/*fonction pour graphiquement valider l'action de l'user*/
		if (addOrDelete === "add"){
			/* on teste l'argument passé afin de savoir quelle action ete faite*/
			var status = document.getElementById('status');
			status.textContent = 'Nouveau type sauvegardé.';
			/*on affiche un message pendant 1 sec puis on le supprime*/
			setTimeout(function() {
				status.textContent = '';
			}, 1000);
		}
	}
}
document.addEventListener("DOMContentLoaded", function(event) { 
	app.init();
});