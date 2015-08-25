/******************************************

GenericModalModel

Alex Klibisz, 2/21/15

This service handles all options and 
manipulation for modals.

******************************************/
mpmap.service('GenericModalModel', ["$modal", function($modal) {

	var modal = {
		show: false,
		title: null,
		value: null,
		open: function(title, value) {
			open(title, value);
		},
		close: function() {
			close();
		}
	};

	function open(title, value) {
		modal.title = title;
		modal.value = value;
		modal.show = true;
	}

	function close() {
		modal.show = false;
		modal.title = null;
		modal.value = null;
	}

	return function() {
		return modal;
	};
}]);