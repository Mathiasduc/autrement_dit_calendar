"use strict";
var app = {
	formSelector: $(".ui.form"),

	init: function(){
		this.checkboxes();
		this.formSettings()
		$(".dropdown").dropdown();
		this.listeners();

	},
	listeners: function(){
		var me = this;
		$("#button_submit").on("click", me.form_values.bind(me));
	},

	formSettings:function(){
		this.formSelector.form();
		//il faut rajouter les  regles semantic
	},

	form_values:function(){
		var form_is_valid = this.formSelector.form('is valid');
		if(form_is_valid){
			var values = this.formSelector.form('get values')
			console.log(values);
			return(values);
		}else{
			return(false);
		}
	},

	checkboxes:function(){
		$('.checkbox').checkbox();
		//il faut rajouter les  regles semantic
	},
};
$(document).ready(function(){
	app.init();
});