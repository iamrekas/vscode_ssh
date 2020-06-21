const inquirer = require('inquirer');
const chalk = require('chalk');
const argv = require('yargs')
    .alias('i', 'interactive')
    .describe('i', 'Don\'t interactive')
    .alias('H', 'host')
    .describe('host', 'Remote server host')
    .alias('P', 'port')
    .describe('port', 'Remote server port')
    .alias('u', 'username')
    .describe('username', 'Remote server username')
    .alias('p', 'password')
    .describe('password', 'Remote server password')
    .alias('h', 'hostname')
    .describe('hostname', 'Remote server hostname')
    .help('help')
    .epilog('copyright 2019')
    .boolean(['i'])
    .default({ port: 22 })
    .argv

module.exports = {
    askRemoteCredentials: async () => {
        if ((!argv.host || !argv.port || !argv.username || !argv.password || !argv.hostname) && !argv.i) {
            console.log(chalk.green('Please enter missing auth credits...'));
        }
      const questions = [];
      if (!argv.host && !argv.i) {
        questions.push({
          name: 'host',
          type: 'input',
          message: 'Enter host:',
          default: argv.host || null,
          when: () => !argv.host,
          validate: function( value ) {
            if (value.length) {
              return true;
            } else {
              return 'Please enter remote server host.';
            }
          }
        });
    }
    if (!argv.port && !argv.i) {
        questions.push({
            name: 'port',
            type: 'number',
            message: 'Enter port:',
            default: argv.port || 22
        });
    }
    if (!argv.username && !argv.i) {
        questions.push({
            name: 'username',
            type: 'input',
            message: 'Enter username:',
            default: argv.username || null,
            validate: function( value ) {
              if (value.length) {
                return true;
              } else {
                return 'Please enter remote server username.';
              }
            }
        });
    }
    if (!argv.password && !argv.i) {
        questions.push({
          name: 'password',
          type: 'password',
          message: 'Enter password:',
          default: argv.password || null,
          validate: function(value) {
            if (value.length) {
              return true;
            } else {
              return 'Please enter remote server password.';
            }
          }
        });
    }
    if (!argv.hostname && !argv.i) {
        questions.push({
            name: 'hostname',
            type: 'input',
            message: 'Enter hostname [optional]:',
            default: argv.hostname || null,
         });
        }
      return inquirer.prompt(questions).then((answers) => {
        return Object.assign({}, {
            host: argv.host,
            port: argv.port,
            username: argv.username,
            password: argv.password,
            hostname: argv.hostname
        }, answers);
      });
    },
  };