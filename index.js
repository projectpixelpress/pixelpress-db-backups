(async () => {
	const getAWSCreds = () => {
		return {
			credentials: {
				accessKeyId: process.env.AWS_AKID,
				secretAccessKey: process.env.AWS_SECRET
			}
		};
	};

	const dbio = require('mongodb-io-native');
	const S3 = require('aws-sdk/clients/s3');
	const s3 = new S3(getAWSCreds());

	const backup = async host => {
		const exportFileName = 'newfile';
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

	const upload = (filename, bucket) => {
		return new Promise(function(resolve, reject) {
			const params = {
				Bucket: bucket,
				Key: filename,
				Body: 'TODO read a file'
			};
			console.log('Uploading with', params);
			s3.upload(params, (err, data) => {
				if (err) {
					return reject(err);
				}
				return resolve(data);
			});
		});
	};

	// const filename = await backup('localhost');
	const filename = 'test';
	return await upload(filename, 'xxxxxxx');
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
