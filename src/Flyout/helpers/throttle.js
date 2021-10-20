{
	throttle: function(fn, delay, threshhold) {
		var defaultize = function(value, defaultVal) {
			value = +value
			if (isNaN(value) || value === 0) {
				value = defaultVal
			};

			return value;
		}
		delay = defaultize(delay, 25);
		threshhold = defaultize(threshhold, delay);

		var lastRunTime = 0;
		var lastAttempt = 0;
		var deferTimer;

		var args;
		var now;
		var runFn = function() {
			lastRunTime = now;
			fn.apply(this, args);
		}.bind(this);

		return function () {
			args = arguments;
			now = Date.now();
			clearTimeout(deferTimer)
			if (now - delay < lastRunTime) {
				var wait = threshhold - (now - lastRunTime)
				deferTimer = setTimeout(runFn, wait);
			} else {
				runFn()
			}
			lastAttempt = now
		};
	}

};
