import ConvexHull from './helpers/convex-hull';
import flyoutPositioning from './helpers/positioning'

class Flyout {
	#flyoutElem
	#flyoutTemplate
	#flyoutContainer

	#pendingRenderActions = {};
	#watchedElements = [];

	constructor (flyoutElem) {
		if (!flyoutElem || !flyoutElem.prototype instanceof HTMLElement) {
			throw 'flyoutElem must be an HTMLElement'
		}

		// Set id on element
		var flyoutId = flyoutElem.getAttribute('id');
		if (!flyoutId) {
			flyoutId = 'f' + Date.now();
			flyoutElem.setAttribute('id', flyoutId);
		}

		this.#flyoutElem = flyoutElem;

		// Store inner HTML
		this.#flyoutTemplate = this.#flyoutElem.innerHTML;
		this.#flyoutElem.innerHTML = '';
	}

	#getPositioningKeys () {
		return {
			attributes: [
			],
			classes: [
				'flyout-against'
			]
		};
	}

	#findParentToPositionAgainst () {
		var flyoutElem = this.flyoutElem;
		var positionAgainstElem;
		if (true) {
			// Get things to check for on parent.
			var positioningKeys = this.#getPositioningKeys();
			if (positioningKeys.attributes) {
				var clone = positioningKeys.attributes.slice(0);
				clone.map(function(attr) {
					return 'data-' + attr;
				}).forEach(function(attr) {
					positioningKeys.attributes.push(attr);
				});
			}

			// Transverse DOM looking for element to position against.
			var searchParentElem = flyoutElem.parentElement;
			while (searchParentElem && !positionAgainstElem) {
				if (positioningKeys.classes instanceof Array) {
					positioningKeys.classes.forEach(function(someClass) {
						if (!positionAgainstElem) {
							if (searchParentElem.classList.contains(someClass)) {
								positionAgainstElem = searchParentElem;
							}
						}
					});
				}
				if (positioningKeys.attributes instanceof Array) {
					positioningKeys.attributes.forEach(function(someAttribute) {
						if (!positionAgainstElem) {
							if (searchParentElem.attributes[someAttribute]) {
								positionAgainstElem = searchParentElem;
							}
						}
					});
				}

				searchParentElem = searchParentElem.parentElement;
			}

		}
		if (!positionAgainstElem) {
			positionAgainstElem = flyoutElem.parentElement;
		}

		return positionAgainstElem;
	}

	get isActive() {
		if (this.#flyoutContainer) {
			return true;
		};
		return false;
	}

	#clearTimers () {
		if (this.$pendingRenderActions) {
			window.cancelAnimationFrame(this.$pendingRenderActions.animationFrame);
			window.clearTimeout(this.$pendingRenderActions.timeout);
		}
		this.$pendingRenderActions = {};
	}

	close () {
		//EventManager.removeActiveFlyout(this);
		this.#clearTimers();
		const containerParent = this.#flyoutContainer?.containerParent;
		if (containerParent) {
			containerParent.removeChild(this.#flyoutContainer);
		}
		this.$flyoutContainer = null;
	}

	#flyoutRender() {
		const flyoutContainer = this.#flyoutContainer;
		if (!flyoutContainer) {
			flyoutContainer = document.createElement('div');
			flyoutContainer.innerHTML = this.#flyoutTemplate;

			window.document.body.appendChild(flyoutContainer);

			flyoutContainer.style.position = 'fixed';
			flyoutContainer.style.top = '0';
			elemLeft = '0';
			flyoutContainer.style.visibility = 'hidden';
		}
	}

	#displayFlyout () {
		var flyout = this;
		var flyoutElem = this.flyoutElem;

		this.#clearTimers();
		const flyoutAlignedToElem = this.#findParentToPositionAgainst();

		this.#pendingRenderActions.animationFrame = window.requestAnimationFrame(() => {
			this.#flyoutRender();
			this.#pendingRenderActions.timeout = window.requestAnimationFrame(() => {
				var flyoutElem = this.#flyoutElem;
				var alignMyAttr = flyoutElem.getAttribute('align-my');
				var alignToAttr = flyoutElem.getAttribute('align-to');

				flyoutPositioning(flyoutElem, flyoutAlignedToElem, {
					alignTo: alignToAttr,
					alignMy: alignMyAttr,
				});
				//EventManager.addActiveFlyout(flyout);
			}, 0);
		});

	}

	/*
	EVENT BINDERS
	*/

	bindOpenerClick() {
		this.#flyoutElem.parentElement.addEventListener('click', this.#clickEvent);
	}
	bindOpenerMouseMove() {
		this.#flyoutElem.parentElement.addEventListener('mouseover', this.#watchMouseOver);
	}
	unbindOpenerActions () {
		this.#flyoutElem.parentElement.removeEventListener('click', this.#clickEvent);
		this.#flyoutElem.parentElement.removeEventListener('mouseover', this.#watchMouseOver);
	}

	/*
	EVENT ACTIONS
	*/

	#watchMouseOver(event) {
		this.unbindOpenerActions();
		this.#displayFlyout();
	};

	#clickEvent(event) {
		this.unbindOpenerActions();
		this.#displayFlyout();
	};

	#processClickEvent(event) {
		if (event.type !== 'click') return;

		if (!ConvexHull.isInsideElement(this.#flyoutContainer, event) &&
			!ConvexHull.isInsideElement(this.#flyoutElem.parentElement, event))
		{
			this.close();
		}
	};

	#processMouseMove(event) {
		if (event.type !== 'hover') return;

		const flyoutParentElem = this.#flyoutElem.parentElement;
		var hull = ConvexHull.buildHull(flyoutParentElem, this.#flyoutContainer);
		if (!hull.isInsideElements(event)) {
			flyoutParentElem.addEventListener('mouseover', this.#watchMouseOver);
			this.close();

			return true;
		}
	};

	#registerScrollEvent(elem) {
		var wrappedScrollEvent = function() {
			if (this.isActive) {
				this.#displayFlyout();
			} else {
				this.#removeScrollEvents();
				elem.removeEventListener('scroll', wrappedScrollEvent);
			}
		};
		this.watchedElements.push({
			elem: elem,
			fn: wrappedScrollEvent
		});
		elem.addEventListener('scroll', wrappedScrollEvent);
	};

	#removeScrollEvents() {
		if (this.watchedElements) {
			this.watchedElements.forEach(function(group) {
				group.elem.removeEventListener('scroll', group.fn);
			});
		}
		this.watchedElements.length = 0;
	};

}

export default Flyout;
