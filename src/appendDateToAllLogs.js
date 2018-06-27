const moment = require('moment');

module.exports = () => {
	const actuallyLog = console.log;
	console.log = function () {
		actuallyLog(moment().format(), ...arguments);
	};
	const actuallyError = console.error;
	console.error = function () {
		actuallyError(moment().format(), ...arguments);
	};
};
