(async () => {
	const dbio = require('mongodb-io-native');

	const backup = async host => {
		const exportFileName = 'newfile';
		const config = {
			host: host,
			port: 27017,
			out: exportFileName
		};
		console.log(`Dumping with ${JSON.stringify(config)}`);
		return await dbio.export({config});
	};

	await backup('localhost');
})().then(
	results => {
		console.log(`Backup finished with ${results}`);
		process.exit();
	},
	error => {
		console.error(`Backup failed with ${error}`);
		process.exit(1);
	}
);
