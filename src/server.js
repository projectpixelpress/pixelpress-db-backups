require('./appendDateToAllLogs')();
const express = require('express');
const app = express();

const backup = require('./backup');

console.log('Setting up routes');
app.post('/backup', async (request, response) => {
	const result = await backup.run();
	response.json(result);
});

console.log('Turning on cron');
require('./cron')();

console.log('Starting web server');
app.listen(3000, () => console.log('Listening on port 3000!'));
