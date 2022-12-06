
import UUID from './UUID.mjs';
import {
	getCodeHeaderAsString,
	getCodeFooterAsString
} from './worker/WorkerFunctionEmitter.mjs';

var convertCodeLinksToStrings = function(codeBit) {
    if (!codeBit) {
        codeBit = '';
    }

    if (codeBit.indexOf('\n') !== -1) {
        return Promise.resolve(codeBit);
    } else {
        return fetch(codeBit).then(r => r.blob());
    }
}

var stringifyCodeBits = function(codeBits) {
    var blobs = [];
    switch (typeof codeBits) {
        case 'string':
            codeBits = [codeBits];
        case 'array':
            blobs = codeBits.map(convertCodeLinksToStrings);
        default:
            break;
    }

    return blobs;
}

const registerFunction = (data, configs) => {
	const passthroughFn = function() {
		var params = [];
		for(var a of arguments) {
			params.push(a);
		}

		var payload = {
			type: 'function',
			name: data.name,
			data: params,
			respondCode: this.hasResponse ? UUID() : null,
		}
		configs.worker.postMessage(payload);

		if (this.hasResponse) {
			var p = new Promise(function(resolve, reject) {
				configs.pending[payload.respondCode] = resolve
			});
			return p;
		}
		return null;
	}

	passthroughFn.hasResponse = data.hasResponse;
	configs.customWorker[data.name] = passthroughFn.bind(passthroughFn);
}

const registerEvent = (data, configs) => {
	const onEventHandler = (fn) => {
		let registeredEvents = configs.events[data.name];
		if (!registeredEvents) {
			registeredEvents = new Set();
			configs.events[data.name] = registeredEvents;
		}

		registeredEvents.add( fn )
	}

	const offEventHandler = (fn) => {
		const registeredEvents = configs.events[data.name];
		if (registeredEvents) {
			registeredEvents.delete( fn )
		}
	}

	const fnName = data.name.slice(0,1).toUpperCase() + data.name.slice(1)
	configs.customWorker[`on${fnName}`] = onEventHandler;
	configs.customWorker[`off${fnName}`] = offEventHandler;
}

const register = function(data, configs) {
	const registerByType = {
		'function': registerFunction,
		'event': registerEvent,
	}
	const registerFn = registerByType[data.register];
	if (registerFn) {
		registerFn(data, configs);
	}
}

const processResponse = (data, configs) => {
	var pendingResolver = configs.pending[data.id];
	if (pendingResolver) {
		delete configs.pending[data.id];
		pendingResolver(data.response)
	}
}

const processEvent = (data, configs) => {
	const registeredEvents = configs.events[data.name];
	if (registeredEvents) {
		for (const fn of registeredEvents) {
			fn.apply(fn, data.eventParams)
		}
	}
}

const lockWorker = (data, configs) => {
	Object.freeze(data.customWorker)
	configs.workerIsReady()
}

class CustomWorker {
	static getWorker() {
		return window.Worker;
	}
	static getBlob() {
		return window.Blob;
	}
	static createObjectURL(codeForWorker) {
		return window.URL.createObjectURL(codeForWorker);
	}

	constructor(codeBits) {
		const configs = {
			customWorker: this,
			worker: null,
			pending: {},
			events: {},
			workerIsReady: null,
		}
		configs.customWorker.isReady = new Promise(function(resolve, reject) {
			configs.workerIsReady = resolve;
		});

		const messageProcessors = {
			'register': register,
			'response': processResponse,
			'event': processEvent,
			'lock': lockWorker,
		}

	    Promise.all([
			convertCodeLinksToStrings( getCodeHeaderAsString ),
			...stringifyCodeBits( codeBits ),
			convertCodeLinksToStrings( getCodeFooterAsString ),
		]).then(function(codeStrings) {
			const classStatics = configs.customWorker.constructor;
			const iifeCode = codeStrings.map(str => `(function() {${str}}).bind(this)();`)
			const BlobClass = classStatics.getBlob()
	        var codeForWorker = new BlobClass(iifeCode, {type: 'application/javascript'});
	        var codeUrl = classStatics.createObjectURL(codeForWorker);

			const WorkerClass = classStatics.getWorker()
	        configs.worker = new WorkerClass(codeUrl)
	        configs.worker.onmessage = function(messageEvent) {
	            var data = messageEvent.data;

				const processorFn = messageProcessors[data.action];
				if (processorFn) {
					processorFn( data, configs )
				}
	        }
	    });
	}
}

export default CustomWorker;
if (typeof window == 'object') {
	window.CustomWorker = CustomWorker;
}
