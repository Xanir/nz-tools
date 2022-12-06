export default [
	{
		input: 'src/Flyout/Flyout-WebComponent.js',
		output: {
			file: 'bundle.js',
			format: 'umd'
		}
	},
	{
		input: 'src/WebWorkerConnector/CustomWorker.mjs',
		output: {
			file: 'worker-bundle.js',
			name: 'CustomWorker',
			format: 'umd'
		}
	},
];
