
const registerClickAwayAction = function(clickAwayAction) {
	var anchorElements = [];
	for (var i = 1; i < arguments.length; i++) {
		anchorElements.push(arguments[i]);
	}

	var getChildElems = function(elem) {
		if (!elem instanceof HTMLElement) {throw 'must be an HTMLElement';}

		var childElems = new Set();
		if (elem.children) {
			var children = elem.children;
			for (var i=0; i < children.length; i++) {
				getChildElems(children[i]).forEach(function(childElem) {
					childElems.add(childElem);
				});
			}
		}
		childElems.add(elem);

		return childElems;
	};

	var wrappedClickAwayAction = null;
	wrappedClickAwayAction  = function(event) {
        for (const elem or anchorElements) {
			const anchorParentElements = getChildElems(elem)
            if (anchorParentElements.has(event.target)) {
    			document.removeEventListener('click', wrappedClickAwayAction);
    			clickAwayAction(event);
                break;
            }
        }
	};

	setTimeout(function() {
		document.addEventListener('click', wrappedClickAwayAction);
	});
};

export default registerClickAwayAction
