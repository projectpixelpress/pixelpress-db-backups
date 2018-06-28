// Adapted from https://github.com/majexa/mongodb-io-native

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

module.exports = {
	getExportCommand({config, dbs} = {}) {
		config = setConfig(config);
		return getBackupCommand(config, dbs);
	}
};
