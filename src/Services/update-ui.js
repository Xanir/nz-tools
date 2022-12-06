
module.exports = updateUI = function(getValues, updateValue) {
	window.setTimeout(function() {
		const values = getValues.call(getValues);
		window.requestAnimationFrame(function() {
			updateValue.call(updateValue, values)
		})
	}, 1);
};
