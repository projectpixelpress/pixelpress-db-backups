(async () => {
	const readEnvironmentVariables = () => {
		console.log('Reading from environment');
		const map = new Map([
			['bucketName', 'AWS_S3_BACKUP_BUCKET'],
			['accessKeyId', 'AWS_AKID'],
			['secretAccessKey', 'AWS_SECRET']
			// TODO add host
			// TODO add folder name for backups
		]);

		const out = {};

		for (const [key, value] of map) {
			console.log(`Reading ${value} from environment`);
			out[key] = process.env[value];
			console.log(`  found ${out[key]}`);
		}

		return out;
	};

	const environment = readEnvironmentVariables();

	const credentials = {
		credentials: {
			accessKeyId: environment.accessKeyId,
			secretAccessKey: environment.secretAccessKey
		}
	};

	const dbio = require('mongodb-io-native');
	const S3 = require('aws-sdk/clients/s3');
	const s3 = new S3(credentials);
	const fs = require('fs');
	const moment = require('moment');

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

	const upload = (filePath, awsKey, bucket) => {
		return new Promise(function(resolve, reject) {
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

	const filePath = await backup('localhost');
	const key = buildKey(filePath, 'testfolder');
	return await upload(filePath, key, environment.bucketName);
})().then(
	results => {
		console.log(`Backup finished with ${JSON.stringify(results)}`);
		process.exit();
	},
	error => {
		console.error(`Backup failed with ${error}`);
		process.exit(1);
	}
);
