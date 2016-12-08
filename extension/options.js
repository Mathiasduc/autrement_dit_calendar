var app = {
	select: document.getElementById('type'),

	init: function(){
		this.populateSelect();
		this.listeners();
	},

	populateSelect: function(options){
		var me = this;
		me.select.options.length = 1; /* on reinitialise le nombre d'option du select a 1(default option)*/
		function populate(){
			var optionsLength = options.length;
			for (var i = 0; i < optionsLength; i++) {
				var currentOption = options[i];
				me.select.options[me.select.options.length] = new Option(currentOption, currentOption); /*on affecte tout les valeur recuperee en memoire a des nouvelles options pour le select*/
			}	
		}
		if(!options){
			console.log("populate options undefined")
			chrome.storage.sync.get(function(result){
				options = result.type;
				populate();
				/*object global chrome depuis lequel on a acces a .storage grace a la permission dans le manifest .sync pour stockage synchronisé (voir doc)*/
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
		var newType = document.getElementById('type_add').value;
		if(!newType){ 
			/*verfie que la valeur n'est pas nulle*/
			me.animationFeedback('empty');
			return(1);
		}
		newType = newType.trim().replace(/ /g,"_");	/*on enleve les espaces de debut et de fin(trim) et on remplace les espaces restants avec des underscores (REGEX)*/
		chrome.storage.sync.get(function(result){
			result.type.push(newType);
			chrome.storage.sync.set({type: result.type}, function() {
				me.animationFeedback("add");
				me.populateSelect(result.type);
			});
		});
	},

	deleteOptions:function(event){
		event.preventDefault();
		var me = this;
		var valueToDelete = me.select.options[me.select.selectedIndex].value; /*on recup la valeur de l'element selectionne dans le select*/
		console.log(valueToDelete);
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
		/*fonction pour graphiquement valider l'action de l'user*/
		var status = document.getElementById('status');
		var timerAnimation;
		function messageTimer(message){
			status.textContent = message;
			/*on affiche un message pendant 3 sec puis on le supprime*/
			timerAnimation = setTimeout(function() {
				status.textContent = '';
			}, 3000);
		}
		clearTimeout(timerAnimation); /*on s'assure qu'il ny ais pas d'animation en cours*/
		status.textContent = '';

		if (typeOfMessage === "add"){
			/* on teste l'argument passé afin de savoir quelle action ete faite*/
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