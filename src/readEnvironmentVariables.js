module.exports = () => {
	const map = new Map([
		['bucketName', 'AWS_S3_BACKUP_BUCKET'],
		['accessKeyId', 'AWS_AKID'],
		['secretAccessKey', 'AWS_SECRET'],
		['host', 'DB_HOST'],
		['subfolder', 'AWS_BUCKET_SUBFOLDER']
	]);

	const out = {};

	for (const [key, value] of map) {
		console.log(`Reading ${value} from environment`);
		out[key] = process.env[value];
		console.log(`  found ${out[key]}`);
	}

	return out;
};
