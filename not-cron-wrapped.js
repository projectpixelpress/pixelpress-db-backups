const app = require('./app');

app.run().then(
	results => {
		console.log(`Backup finished with ${JSON.stringify(results)}`);
		process.exit();
	},
	error => {
		console.error(`Backup failed with ${error}`);
		process.exit(1);
	}
);
