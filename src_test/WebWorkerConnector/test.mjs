import CustomWorker from '../../src/WebWorkerConnector/CustomWorker.mjs';
import { expect } from 'chai';

class MockBlob {
	constructor(blob) {
		this.data = blob;
	}
}
CustomWorker.getBlob = function() {
	return MockBlob;
}

class MockWorker {
	constructor(blob) {
		const mockWorker = this;
		let processCode = function() {
			mockWorker.mockMainContext = this;

			this.postMessage = (data) => {
				mockWorker.onmessage({ data: data })
			}

			try {
				for (let fn of blob) {
					fn = Function(fn).bind(this);
					fn()
				}
			} catch (e) {console.log(e)}
		}
		setTimeout(processCode)
	}
	postMessage(data) {
		this.mockMainContext.onmessage(data)
	}
}
CustomWorker.getWorker = function(codeBits) {
	return MockWorker;
}
CustomWorker.createObjectURL = function(blobObj) {
	return blobObj.data;
}

const functionToString = function(fn) {
	var innerFnCode = fn.toString().slice(13);
	innerFnCode = innerFnCode.slice(0, innerFnCode.length-2);

	return innerFnCode;
}

const workerCode = function() {
	const data = [];

	const emitChange = this.registerEvent('change')

	this.registerFunction('addNumber', (val) => {
		data.push(val)
		emitChange(data.reduce(v, t => { v + t }))
    });
	this.registerFunction('getResultCount', () => {
		return data.length;
    }, true);

	this.registerFunction('processNumbers', function(a, b, c) {
	  return a + b + c;
    }, true)

}

describe('WebWorkerConnector', function() {
	it('register function', async function() {
		const workerCodeStr = functionToString(function() {
			this.registerFunction('addNumber', () => {})
		})
		const myWorker = new CustomWorker(workerCodeStr)
		await myWorker.isReady;

		expect(typeof myWorker.addNumber).equal('function');
	});

	it('register event', async function() {
		const workerCodeStr = functionToString(function() {
			const emitChange = this.registerEvent('change')
		})
		const myWorker = new CustomWorker(workerCodeStr)
		await myWorker.isReady;

		expect(typeof myWorker.onChange).equal('function');
		expect(typeof myWorker.offChange).equal('function');
	});

	it('register function', async function() {
		const workerCodeStr = functionToString(workerCode)
		const myWorker = new CustomWorker(workerCodeStr)
		await myWorker.isReady;

		expect(typeof myWorker.addData).equal('function');
		expect(typeof myWorker.addValues).equal('function');
		expect(typeof myWorker.pushData).equal('function');
	});

});
