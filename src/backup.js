const dbio = require('mongodb-io-native');
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const moment = require('moment');
const readEnvironmentVariables = require('./readEnvironmentVariables');

const backup = async host => {
	const exportFileName = `backup-${host}-${moment().format()}`;
	const config = {
		host: host,
		port: 27017,
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
	const environment = readEnvironmentVariables();

	const credentials = {
		credentials: {
			accessKeyId: environment.accessKeyId,
			secretAccessKey: environment.secretAccessKey
		}
	};

	const filePath = await backup(environment.host || 'localhost');
	const key = buildKey(filePath, environment.subfolder);
	return await upload(filePath, key, environment.bucketName, credentials);
};

module.exports = {
	run: run
};
