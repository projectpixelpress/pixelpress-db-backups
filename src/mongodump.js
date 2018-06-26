// Adapted from https://github.com/majexa/mongodb-io-native

const {exec, execSync} = require('child_process');

const setConfig = (config = {}) => {
	const defaultConfig = {
		host: '127.0.0.1',
		port: 27017,
		user: '',
		password: '',
		command: 'mongodump',
		out: 'dump'
	};
	for (const key in defaultConfig) {
		config[key] = config[key] || defaultConfig[key];
	}
	return config;
};

const getCommand = config => {
	const getCmd = ({dbName, collectionName, query} = {}) => {
		const {host, port, user, password, command, out} = config;
		let cmd = `${command} -h ${host} --port ${port} -o /tmp/${out}`;
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
	export({config, dbs} = {}) {
		config = setConfig(config);
		const command = getCommand(config, dbs);
		execSync(`rm -rf '${config.out}'`, {cwd: '/tmp'});
		return new Promise((resolve, reject) => {
			execSync(command);
			exec(`tar zcvf '${config.out}.tar.gz' '${config.out}'`, {cwd: '/tmp'}, (err, out, stderr) => {
				process.stderr.write(out + stderr + '\n');
				if (err) reject(err);
				exec(`rm -rf '${config.out}'`, {cwd: '/tmp'}, (err, out, stderr) => {
					process.stderr.write(out + stderr + '\n');
					if (err) reject(err);
					resolve(`/tmp/${config.out}.tar.gz`);
				});
			});
		});
	}
};
