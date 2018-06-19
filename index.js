(async () => {
	const dbio = require('mongodb-io');

	const backup = async ip => {
		const options = {
			host: ip,
			port: 27017,
			// user,
			// password,
			// export filename
			out: 'dump'
			// drop: false, // Before restoring the collections from the dumped backup, drops the collections from the target database.
			// filePath: '' // path to read `tar.gz` file for mongorestore.
		};
		console.log(`Dumping ${JSON.stringify(options)}`);
		const filename = await dbio.export(options);
		return filename;
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
