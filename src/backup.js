const dbio = require('./mongodump');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const moment = require('moment');
const readEnvironmentVariables = require('./readEnvironmentVariables');

let lastRun = {
	datetime: -1,
	status: 204,
	lastError: undefined,
	lastFile: undefined
};

const backup = async (host, command) => {
	const exportFileName = `backup-${host}-${moment().format()}`;
	const config = {
		host: host,
		port: 27017,
		command: command,
		out: exportFileName
	};
	console.log(`Dumping with ${JSON.stringify(config)}`);
	return await dbio.export({
		config
	});
};

const buildKey = (filePath, folderName) => {
	let key = filePath.replace('/tmp/', '');
	if (folderName) {
		key = folderName + '/' + key;
	}
	return key;
};

const upload = (filePath, awsKey, bucket, credentials) => {
	return new Promise(function(resolve, reject) {
		const s3 = new S3(credentials);
		fs.readFile(filePath, (err, data) => {
			if (err) {
				return reject(err);
			}

			const params = {
				Bucket: bucket,
				Key: awsKey,
				Body: data
			};

			console.log('Uploading with', params);
			s3.upload(params, (err, data) => {
				if (err) {
					return reject(err);
				}
				return resolve(data);
			});
		});

	});
};

const run = async () => {
	lastRun.datetime = moment().format();
	lastRun.status = 'starting';
	try {
		console.log(`Backup starting`);
		const environment = readEnvironmentVariables();

		const credentials = {
			credentials: {
				accessKeyId: environment.accessKeyId,
				secretAccessKey: environment.secretAccessKey
			}
		};

		const filePath = await backup(environment.host || 'localhost', environment.mongodump || 'mongodump');
		const key = buildKey(filePath, environment.subfolder);
		const response = await upload(filePath, key, environment.bucketName, credentials);
		console.log(`Backup finished with ${JSON.stringify(response)}`);
		lastRun.status = 200;
		lastRun.datetime = moment().format();
		lastRun.lastFile = response;
		return response;
	} catch(error) {
		console.log(error);
		lastRun.status = 500;
		lastRun.lastError = JSON.stringify(error);
		lastRun.dateTime = moment().format();
	}
};

module.exports = {
	lastRun: lastRun,
	run: run
};
