import FlyoutComponent from './Flyout';

try {
	const NzFlyout = class NzFlyout extends HTMLElement {
		#flyout

		createdCallback () {
			this.#flyout = new FlyoutComponent(this)
		};

		attachedCallback () {
			// Process element attributes
			this.attributeChangedCallback('flyout-on',  null, this.getAttribute('flyout-on'));
		};

		detachedCallback () {
			// Process element attributes
			this.attributeChangedCallback('flyout-on',  this.getAttribute('flyout-on'), null);
		};

		attributeChangedCallback (name, oldValue, newValue) {
			if (name === 'flyout-on') {
				if (newValue) {
					this.#flyout.unbindOpenerActions();

					if (typeof newValue === 'string') {
						newValue = newValue.split(' ');
						if (newValue.indexOf('click') >= 0) {
							this.#flyout.bindOpenerClick();
						} else if (newValue.indexOf('hover') >= 0) {
							this.#flyout.bindOpenerMouseMove();
						}
					}
				}
			}
		};
	}

	document.registerElement('nz-flyout', {
		prototype: NzFlyout
	});

} catch (e) {
	console.error('Could not create flyout webcomponent')
}
