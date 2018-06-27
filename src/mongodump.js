// Adapted from https://github.com/majexa/mongodb-io-native

const {exec} = require('child_process');

const setConfig = (config = {}) => {
	const defaultConfig = {
		host: '127.0.0.1',
		port: 27017,
		user: '',
		password: '',
		pathToMongodump: 'mongodump',
		out: 'dump'
	};
	for (const key in defaultConfig) {
		config[key] = config[key] || defaultConfig[key];
	}
	return config;
};

const getBackupCommand = config => {
	const getCmd = ({dbName, collectionName, query} = {}) => {
		const {host, port, user, password, pathToMongodump, out} = config;
		let cmd = `${pathToMongodump} --host ${host}:${port} -o /tmp/${out} --quiet`;
		if (user) cmd += ` -u ${user}`;
		if (password) cmd += ` -p ${password}`;
		if (dbName) cmd += ` -d ${dbName}`;
		if (collectionName) cmd += ` -c ${collectionName}`;
		if (query) cmd += ` -q '${query}'`;
		return cmd;
	};
	return getCmd();
};

const wrapInPromise = function() {
	return new Promise((resolve, reject) => {
		console.log(...arguments);
		exec(...arguments, (error) => {
			if (error) {
				return reject(error);
			}
			return resolve();
		});
	});
};

module.exports = {
	async export({config, dbs} = {}) {
		config = setConfig(config);
		const backupCommand = getBackupCommand(config, dbs);
		await wrapInPromise(`rm -rf '${config.out}'`, {cwd: '/tmp'});
		await wrapInPromise(backupCommand);
		await wrapInPromise(`tar zcvf '${config.out}.tar.gz' '${config.out}'`, {cwd: '/tmp'});
		await wrapInPromise(`rm -rf '${config.out}'`, {cwd: '/tmp'});

		return `/tmp/${config.out}.tar.gz`;
	}
};
