
module.exports = registerClickAwayAction = function(clickAwayAction) {
	var anchorElements = [];
	for (var i = 1; i < arguments.length; i++) {
		anchorElements.push(arguments[i]);
	}

	const populateChildren = function(elem, childElems) {
		if (!elem instanceof HTMLElement) {throw 'must be an HTMLElement';}

		if (elem.children) {
			var children = elem.children;
			for (const )
			for (var i=0; i < children.length; i++) {
				const children = getChildElems(children[i])
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
		for (const elem of anchorElements) {
			const anchorParentElements = new Set()
			populateChildren(elem, anchorParentElements)
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
