const cron = require('node-cron');
const backup = require('./backup');


module.exports = () => {
	const env = require('./readEnvironmentVariables')();

	const schedule = env.cronSchedule || '0 20 * * *';

	console.log(`Initializing cron with schedule '${schedule}'`);
	cron.schedule(schedule, () => {
		console.log('Crontask starting');
		backup.run();
	});
};
