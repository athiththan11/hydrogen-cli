const { Command, flags } = require('@oclif/command');
const { ExecutionPlans, DatasourceConfigs, Utils, Docker, ConfigMaps } = require('../../../../hydrogen-core');

class DatasourceISCommand extends Command {
	async run() {
		const { flags } = this.parse(DatasourceISCommand);

		const version = flags.version;
		const datasource = flags.datasource;
		const replace = flags.replace;
		const container = flags.contianer;
		const generate = flags.generate;

		if (replace) {
			this.log(`Starting to configure WSO2 API Manager ${version}`);
			// mysql datasource block
			if (datasource === ConfigMaps.Hydrogen.datasource.mysql) {
				await ExecutionPlans.Datasource.replaceISCarbonDatasource(
					process.cwd(),
					DatasourceConfigs.MySQL.getDatasourceConfigs(ConfigMaps.Hydrogen.platform.is, { replace })
				);
				if (container) {
					await Docker.MySQL.createMySQLDockerContainer(
						ConfigMaps.Hydrogen.platform.is,
						{ replace, generate },
						process.cwd()
					);
				}
				Utils.Docs.generateDBDriverDocs(ConfigMaps.Hydrogen.datasource.mysql);
			}
		}

		if (!replace) {
			this._help();
		}
	}
}

DatasourceISCommand.usage = ['datasource:is [FLAG] [ARG]'];
DatasourceISCommand.description = `Alter datasource configurations related WSO2 Identity Server products with supported datasource config models
...
Alter datasource configurations of WSO2 Identity Server based on your requirement`;
DatasourceISCommand.examples = [
	`Replace Carbon H2 datasource with MySQL
$ hydrogen datasource:is --replace -v 5.7 --datasource mysql`,
];

DatasourceISCommand.flags = {
	contianer: flags.boolean({
		char: 'c',
		description: 'create a docker container for the datasource',
		hidden: false,
		multiple: false,
		required: false,
		dependsOn: ['datasource'],
	}),
	datasource: flags.string({
		char: 'd',
		description: 'the type of datasource. refer to the supported options below',
		hidden: false,
		multiple: false,
		required: true,
		options: [ConfigMaps.Hydrogen.datasource.mysql],
	}),
	generate: flags.boolean({
		char: 'g',
		description: 'create database and tables in the docker container',
		hidden: false,
		multiple: false,
		required: false,
		dependsOn: ['container'],
	}),
	replace: flags.boolean({
		char: 'r',
		description: 'replace Carbon H2 datasource configuration',
		hidden: false,
		multiple: false,
	}),
	version: flags.string({
		char: 'v',
		description: 'version of the WSO2 Identity Server',
		hidden: false,
		multiple: false,
		required: true,
		default: '5.7',
		options: ['5.7'],
	}),
};
module.exports = DatasourceISCommand;