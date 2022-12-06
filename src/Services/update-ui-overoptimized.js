
const asyncTimeout = async () => {
	return new Promise(function(resolve) {
		window.setTimeout(resolve)
	});
}
const asyncAnimationFrame = async () => {
	return new Promise(function(resolve, reject) {
		window.requestAnimationFrame(resolve)
	});
}

const queueValues = [];
const queueUpdates = [];
let queueId = 0;

const processValues = () => {
	while (queueValues.length) {
		const obj = queueValues.pop();
		const getValues = obj.getValuesFn;
		obj.values = getValues ? getValues.call(getValues) : null;
		queueUpdates.push(obj);
	}
}

const processUpdates = () => {
	while (queueUpdates.length) {
		const obj = queueUpdates.pop();
		obj.updateValuesFn.call(obj.updateValuesFn, obj.values);
	}
}

const processQueues = async () => {
	await asyncTimeout();
	processValues();
	await asyncAnimationFrame();
	processUpdates();
}

module.exports = updateUI = async function(getValues, updateValues) {
	window.clearTimeout(queueId);
	queueValues.push({
		getValuesFn: getValues,
		updateValuesFn: updateValues,
	});
	queueId = window.setTimeout(processQueues, 1)
};
