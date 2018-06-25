const moment = require('moment');

module.exports = () => {
	const actuallyLog = console.log;
	console.log = function () {
		actuallyLog(moment().format(), ...arguments);
	};
};
