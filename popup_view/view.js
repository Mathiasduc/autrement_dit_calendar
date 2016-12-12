"use strict";
var app = {
	formSelector: $(".ui.form"),
	input_result: $("#input_result"),
	input_form: $(".ui.form input"),

	init: function(){
		this.formSettings();
		this.populateSelect();
		this.populateForm();
		this.checkboxes();
		$(".dropdown").dropdown();
		this.listeners();
	},

	populateForm: function(){
		var me = this;
		chrome.storage.local.get(function(result){
			if(result.savedValues){
				var transformedValues = me.transformOnStateToTrue(result.savedValues);
				me.formSelector.form('set values', transformedValues);
				me.displayResult();
			}
		});
	},

	transformOnStateToTrue: function(savedValues){
		if(savedValues.canceled_after_48h){
			savedValues.canceled_after_48h = true;	
		}
		if(savedValues.canceled_before_48h){
			savedValues.canceled_before_48h = true;	
		}
		if(savedValues.to_bill){
			savedValues.to_bill = true;	
		}
		return(savedValues);
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
	},

	formSettings:function(){
		this.formSelector.form();
	},

	form_values:function(){
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
			chrome.tabs.sendMessage(tabs[0].id, {"toDisplay": stringOutput});
		});
		chrome.storage.local.set({'savedValues': values});
		return(stringOutput);
	},
	
	displayResult:function(){
		var result = this.outputFormatting();
		this.input_result.val(result);
	},

	copyToClipboard: function(event){
		var idOfElementToCopy = event.target.dataset.copytarget;	
		var elementToCopy = document.querySelector(idOfElementToCopy);
		elementToCopy.select(); 			
		try {								
			document.execCommand('copy'); 	
			elementToCopy.blur(); 			
			this.animationFeedbackCopy();	
		}
		catch (err) {
			console.log('Erreur: ',err); 	
		}
	},

	checkboxes:function(){
		$('.checkbox').checkbox();
		$('#canceled_after_48h').checkbox('attach events', '#canceled_before_48h', 'uncheck');
		$('#canceled_before_48h').checkbox('attach events', '#canceled_after_48h', 'uncheck');

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