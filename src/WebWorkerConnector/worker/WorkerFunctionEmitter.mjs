
const workerCodeHeader = function() {
 	const workerContext = this;

    var registeredFuctions = {};
    workerContext.onmessage = function(messageEvent) {
        var mData = messageEvent.data;
        if (mData.action === 'function');

        var fnAction = registeredFuctions[mData.name];
        if (fnAction) {
            var response = fnAction.fn.apply(fnAction, mData.data);
            if (mData.respondCode) {
                workerContext.postMessage({
                    id: mData.respondCode,
                    action: 'response',
                    response: response
                });
            }
        }
    }

    workerContext.registerFunction = function(fnName, fnCode, hasResponse) {
        workerContext.postMessage({
            action: 'register',
			register: 'function',
			name: fnName,
			hasResponse: !!hasResponse,
        });
        registeredFuctions[fnName] = {fn: fnCode};
    }

    workerContext.registerEvent = function(eventName) {
        workerContext.postMessage({
            action: 'register',
			register: 'event',
			name: eventName,
        });

		return function() {
			const params = [];
			for(var a of arguments) {
				params.push(a);
			}

	        workerContext.postMessage({
	            action: 'event',
				name: eventName,
	            eventParams: params,
	        });
		}
    }
};

const workerCodeFooter = function() {
	const workerContext = this;

	workerContext.postMessage({
		action: 'lock'
	});
}

const functionToString = function(fn) {
	var innerFnCode = fn.toString().slice(13);
	innerFnCode = innerFnCode.slice(0, innerFnCode.length-2);

	return innerFnCode;
}

export const getCodeHeaderAsString = functionToString(workerCodeHeader);
export const getCodeFooterAsString = functionToString(workerCodeFooter);
