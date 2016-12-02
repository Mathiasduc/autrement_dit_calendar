"use strict";
var app = {
	formSelector: $(".ui.form"),
	input_result: $("#input_result input"),

	init: function(){
		this.checkboxes();
		this.formSettings()
		$(".dropdown").dropdown();
		this.listeners();

	},
	listeners: function(){
		var me = this;
		me.formSelector.on("on change", me.displayResult.bind(me));
	},

	formSettings:function(){
		this.formSelector.form();
		//il faut rajouter les  regles semantic
	},

	form_values:function(){
		var form_is_valid = this.formSelector.form('is valid');
		if(form_is_valid){
			var values = this.formSelector.form('get values');
			return(values);
		}else{
			return(false);
		}
	},

	outputFormatting: function(){
		var values = this.form_values();
		var stringOutput = "";
		console.log(values);
		if(!values){
			return(values);
		}
		else{
			if(values.type){
				stringOutput += "[T:"+ values.type + "]";	
			}
			if(values.name){
				stringOutput += "[N:" + values.name + "]";		
			}
			if(values.accounting_number){
				stringOutput += "[C:" + values.accounting_number + "]";
			}
			if(values.canceled_after_48h){
				stringOutput += "[A:" + "Annulé moins de 48h" + "]";
			}
			if(values.canceled_before_48h){
				stringOutput += "[A:" + "Annulé plus de 48h" + "]";
			}
			if(values.to_bill){
				stringOutput += "[F:" + "A facturer" + "]";
			}
			console.log(stringOutput);
			return(stringOutput);
		}
	},
	
	displayResult:function(){
		console.log(this.input_result)
		this.input_result.val("test");
		var result = this.outputFormatting();
		this.input_result.val(result);
	},

	checkboxes:function(){
		var canceled_after_48h = $('#canceled_after_48h');
		var canceled_before_48h = $('#canceled_before_48h');
		$('.checkbox').checkbox();
		
		/*Ces deux fonctions permetent de s'assurer que une seul checkbox peut etre check.
		Ces deux fonctions tiennent compte du niveau d'absatraction que semantic implemente.
		On remarque que on cible la div de la checkbox et pas la checkbox elle meme.
		Ces deux "event" sont, si j'ain bien compris, des raccourcis pour des listeners.
		L'on pourrais aussi utiliser cette fonction listener pour chaqu'une des deux checkbox: */
		
		/* canceled_after_48h.on('change',function(){
			if(canceled_before_48h.checkbox('is checked')){
				canceled_before_48h.checkbox('uncheck')
			}
		});*/

		$('#canceled_after_48h').checkbox('attach events', '#canceled_before_48h', 'uncheck');
		$('#canceled_before_48h').checkbox('attach events', '#canceled_after_48h', 'uncheck');
	},
};
$(document).ready(function(){
	app.init();
});