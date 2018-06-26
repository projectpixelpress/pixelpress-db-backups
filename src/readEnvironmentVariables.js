module.exports = () => {
	const map = new Map([
		['bucketName', 'AWS_S3_BACKUP_BUCKET'],
		['accessKeyId', 'AWS_AKID'],
		['secretAccessKey', 'AWS_SECRET'],
		['host', 'DB_HOST'],
		['subfolder', 'AWS_BUCKET_SUBFOLDER'],
		['mongodump', 'MONGODUMP_LOCATION'],
		['cronSchedule', 'CRON_SCHEDULE']
	]);

	const out = {};

	for (const [key, value] of map) {
		out[key] = process.env[value];
		console.log(`Environment ${value} was ${out[key]}`);
	}

	return out;
};
