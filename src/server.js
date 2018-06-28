require('./appendDateToAllLogs')();
const express = require('express');
const app = express();

const backup = require('./backup');

console.log('Setting up routes');
app.post('/backup', async (request, response) => {
	backup.run();
	response.status(backup.lastRun.status).json();
});
app.get('/backup', (request, response) => {
	response.status(backup.lastRun.status).json(backup.lastRun);
});

console.log('Turning on cron');
require('./cron')();

console.log('Starting web server');
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
