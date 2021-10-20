if (!window.EnzeyNet) {window.EnzeyNet = {};}

const FlyoutWrapper = function () {}
FlyoutWrapper.prototype.createdCallback = function() {
	this.Flyout = new FlyoutComponent(this)
}

FlyoutWrapper.prototype.attachedCallback = function() {
		this.Flyout.attachedCallback.apply(this.Flyout, arguments)
}

FlyoutWrapper.prototype.detachedCallback = function() {
		this.Flyout.detachedCallback.apply(this.Flyout, arguments)
}

FlyoutWrapper.prototype.attributeChangedCallback = function() {
		this.Flyout.attributeChangedCallback.apply(this.Flyout, arguments)
}

FlyoutWrapper.prototype.displayFlyout = function() {
		this.Flyout.displayFlyout()
}


try {
	EnzeyNet.FlyoutComponent = FlyoutWrapper
	EnzeyNet.applyFunctions = function(someElem, someService) {
		for(var f in someService) {
			if ('function' === typeof someService[f]) {
				someElem[f] = someService[f];
			}
		};
	};

	var flyoutElem = Object.create(HTMLElement.prototype);
	EnzeyNet.applyFunctions(flyoutElem, EnzeyNet.FlyoutComponent);

	// IE8 Shims needed Array.forEach, Array.map, HTMLElement.classList
	document.registerElement('nz-flyout', {
		prototype: flyoutElem
	});

} catch (e) {
	console.error('Could not create flyout webcomponent')
}
