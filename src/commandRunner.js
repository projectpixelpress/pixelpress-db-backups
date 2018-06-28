const {exec} = require('child_process');

module.exports = {
	cmd: function(command, args) {
		console.log('running', command, 'with', args);
		return new Promise((resolve, reject) => {
			exec(command, args, (error) => {
				if (error) {
					return reject(error);
				}
				return resolve();
			});
		});
	},
	args: {cwd: '/tmp', maxBuffer: 1024 * 20}
};
