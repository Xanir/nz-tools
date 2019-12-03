
module.exports = registerClickAwayAction = function(clickAwayAction) {
	var getChildElems = function(elem) {
		if (!elem instanceof HTMLElement) {throw 'must be an HTMLElement';}

		var childElems = [];
		if (elem.children) {
			var children = elem.children;
			for (var i=0; i < children.length; i++) {
				getChildElems(children[i]).forEach(function(childElem) {
					childElems.push(childElem);
				});
			}
		}
		childElems.push(elem);

		return childElems;
	};

	var parentElems = [];
	for (var i = 1; i < arguments.length; i++) {
		parentElems.push(arguments[i]);
	}
	var wrappedClickAwayAction = null;
	wrappedClickAwayAction  = function(event) {
		var allElements = [];
		parentElems.forEach(function(parentElem) {
			getChildElems(parentElem).forEach(function (elem) {
				allElements.push(elem);
			});
		});
		if (allElements.indexOf(event.target) === -1) {
			document.removeEventListener('click', wrappedClickAwayAction);
			clickAwayAction(event);
		}
	};
	setTimeout(function() {
		document.addEventListener('click', wrappedClickAwayAction);
	});
};
