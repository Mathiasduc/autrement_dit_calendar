"use strict";
var app = {
	formSelector: $(".ui.form"),
	input_result: $("#input_result"),
	input_form: $(".ui.form input"),

	init: function(){
		this.formSettings();
		this.populateForm();
		this.populateSelect();
		this.checkboxes();
		$(".dropdown").dropdown();
		this.listeners();
	},

	populateForm: function(){
		var me = this;
		chrome.storage.local.get(function(result){
			if(result.savedValues){
				me.formSelector.form('set values', result.savedValues);
				me.displayResult();
			}
		});
	},

	populateSelect: function(){
		var me = this;
		var select = document.getElementById('type');
		select.options.length = 1;
		chrome.storage.sync.get(function(result){
			if(result.type){
				var typeLength = result.type.length;
				for (var i = 0; i < typeLength; i++) {
					var currentOption = result.type[i];
					select.options[select.options.length] = new Option(currentOption, currentOption );
				}	
			}else{
				me.firstInstall();
			}
		});
	},

	listeners: function(){
		var me = this;
		me.formSelector.on("on change", me.displayResult.bind(me));
		me.input_form.on("keyup", me.displayResult.bind(me));
		document.getElementById('copy').addEventListener("click",me.copyToClipboard.bind(me),true);
		document.getElementById('to_options').addEventListener("click",function(){
			chrome.runtime.openOptionsPage();
		},true);

		/*a delete pour prod*/
		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
			console.log(request, sender);
		});
	},

	formSettings:function(){
		this.formSelector.form();
		/*A FAIRE regles de "danger" pour les mots interdits*/
	},

	form_values:function(){
		/* A FAIRE tester si "danger" et display "danger"
		var form_is_valid = this.formSelector.form('is valid'); */
		var values = this.formSelector.form('get values');
		return(values)
	},

	outputFormatting: function(){
		var values = this.form_values();
		var stringOutput = "";

		if(values.type){
			stringOutput += values.type + " ";
		}
		if(values.name){
			stringOutput +=  values.name + " ";
		}
		if(values.estimate_number){
			stringOutput += values.estimate_number + " ";
		}
		if(values.bill_number){
			stringOutput += values.bill_number + " ";
		}
		if(values.canceled_after_48h){
			stringOutput += "Annulé -48h" + " ";
		}
		if(values.canceled_before_48h){
			stringOutput += "Annulé +48h" + " ";
		}
		if(values.to_bill){
			stringOutput += "A facturer" + " ";
		}
		if(values.input_other){
			stringOutput += values.input_other;
		}	
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {"toDisplay": stringOutput}, function(response) {
				console.log(response);
			});
		});
		chrome.storage.local.set({'savedValues': values});
		return(stringOutput);
	},
	
	displayResult:function(){
		this.input_result.val("test");
		var result = this.outputFormatting();
		this.input_result.val(result);
	},

	copyToClipboard: function(event){
		var idOfElementToCopy = event.target.dataset.copytarget;	  /*recupere l'id(de l'elem qu'on veut cibler) stocké dans le data-copytarget*/
		var elementToCopy = document.querySelector(idOfElementToCopy);/*cible l'element dont on viens de recup l'Id*/
		elementToCopy.select(); 			/*selectionne le contenu de l'input*/ 
		try {								/*on delimite une zone a tester*/
			document.execCommand('copy'); 	/*copie la selection dans le clipboard*/
			elementToCopy.blur(); 			/*fait perde le focus sur l input(et donc deselectionne)*/
			this.animationFeedbackCopy();	/*animation qu il faudrait faire*/
		}
		catch (err) {
			console.log('Erreur: ',err); 	/*si erreur, on la console log*/
		}
	},

	checkboxes:function(){
		$('.checkbox').checkbox();

		/*Ces deux fonctions permetent de s'assurer que une seul checkbox peut etre check.
		Ces deux fonctions tiennent compte du niveau d'absatraction que semantic implemente.
		On remarque que on cible la div de la checkbox et pas la checkbox elle meme.
		Ces deux fonctions sont, si j'ai bien compris, des raccourcis pour creer des listeners(event handlers).*/

		$('#canceled_after_48h').checkbox('attach events', '#canceled_before_48h', 'uncheck');
		$('#canceled_before_48h').checkbox('attach events', '#canceled_after_48h', 'uncheck');

		/*L'on pourrais aussi utiliser cette fonction(en double) pour remplacer les fonction lignes 113 et 114
	
		var canceled_after_48h = $('#canceled_after_48h');
		 canceled_after_48h.on('change',function(){
			if(canceled_before_48h.checkbox('is checked')){
				canceled_before_48h.checkbox('uncheck')
			}
		});*/
	},

	animationFeedbackCopy:function(){
		var button = $('.button');
		button.toggleClass('blue green');

		setTimeout(function(){ 
			button.toggleClass('blue green');
		}, 300);
	},

	firstInstall: function(){
		var listType = ["ACCUEIL", "AO", "ATELIER LSF", "CAFE DU SILENCE", "CIS", "COLL", "DIAG", "DYS", "ETUDE DE POSTE", "FORMATION LSF", "IC", "INITIATION LSF", "LSF", "PERM", "PERSO", "POINT", "PPS 1", "PPS 2", "PPS 3", "PPS 4", "PREPA", "PRO", "RDV", "REMISE A NIVEAU", "REMISE A NIVEAU FRANÇAIS", "REMISE A NIVEAU LSF", "REUNION", "SENSIB"];
		chrome.storage.sync.set({"type": listType});
		this.populateSelect();
	}
};
$(document).ready(function(){
	app.init();
});