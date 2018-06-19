const cron = require('node-cron');
const app = require('./app');

cron.schedule('0 * * * *', () => {
	app.run().then(
		results => {
			console.log(`Backup finished with ${JSON.stringify(results)}`);
		},
		error => {
			console.error(`Backup failed with ${error}`);
		}
	);
});
