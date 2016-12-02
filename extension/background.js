"use strict";
var app = {
	formSelector: $(".ui.form"),
	input_result: $("#input_result"),
	input_form: $(".ui.form input"),
/*	forbiden_words: ["PRO","PERSO","PERM","SENSIB","PPS","PPS_1","PPS_2","PPS_3",
	"Annulé moins de 48h", "Annulé plus de 48h","A facturer"],*/ //on verra ca plus tard

	init: function(){
		this.checkboxes();
		this.formSettings();
		$(".dropdown").dropdown();
		this.listeners();
	},
	
	listeners: function(){
		var me = this;
		me.formSelector.on("on change", me.displayResult.bind(me));
		me.input_form.on("keyup", me.displayResult.bind(me));
		document.getElementById('copy').addEventListener("click",me.copyToClipboard.bind(me),true);
	},

	formSettings:function(){
		this.formSelector.form();
		//il faut rajouter les regles semantic
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
			if(values.input_other){
				stringOutput += "[I:" + values.input_other + "]";
			}	
			return(stringOutput);
		}
	},
	
	displayResult:function(){
		console.log(this.input_result)
		this.input_result.val("test");
		var result = this.outputFormatting();
		this.input_result.val(result);
	},

	copyToClipboard: function(event){
		var idOfElementToCopy = event.target.dataset.copytarget;	  /*recupere l'id(de l'elem qu'on veut cibler) stocké dans le data-copytarget*/
		var elementToCopy = document.querySelector(idOfElementToCopy);/*cible l'element dont on viens de recup l'Id*/
		console.log(elementToCopy);
		elementToCopy.select(); 			/*selectionne le contenu de l'input*/ 
		try {								/*on delimite une zone a tester*/
			document.execCommand('copy'); 	/*copie la selection dans le clipboard*/
			elementToCopy.blur(); 			/*fait perde le focus sur l input(et donc deselectionne)*/
			this.animationFeedbackCopy();
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
		Ces deux "event" sont, si j'ai bien compris, des raccourcis pour des listeners.*/

		$('#canceled_after_48h').checkbox('attach events', '#canceled_before_48h', 'uncheck');
		$('#canceled_before_48h').checkbox('attach events', '#canceled_after_48h', 'uncheck');

		/*L'on pourrais aussi utiliser cette fonction listener pour chaqu'une des deux checkbox:
	
		var canceled_after_48h = $('#canceled_after_48h');
		 canceled_after_48h.on('change',function(){
			if(canceled_before_48h.checkbox('is checked')){
				canceled_before_48h.checkbox('uncheck')
			}
		});*/
	},

	animationFeedbackCopy:function(){
		/*Implementer une animation qui confirmera l'user que le contenu a ete copier dans le clipboard*/
	},
};
$(document).ready(function(){
	app.init();
});