require('./appendDateToAllLogs')();
const express = require('express');
const app = express();

const backup = require('./backup');

app.post('/backup', async (request, response) => {
	const result = await backup.run();
	response.json(result);
});

app.listen(3000, () => console.log('Listening on port 3000!'));
