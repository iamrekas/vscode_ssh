const shell = require('shelljs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const cli = require('./lib/cli');
const vscode = require('./lib/vscode');
const ssh_gen = require('./lib/ssh-gen');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('VSCode SSH Utils', { horizontalLayout: 'full' })
  )
);

if (!vscode.detect() || !ssh_gen.detect()) {
    console.log(chalk.red('Sorry, this script requires vscode and ssh-keygen'));
    process.exit();
}

if (!vscode.detectRemoteExtension()) {
    // not found
    // install command: code --install-extension ms-vscode-remote.remote-ssh
    // TODO: install
    console.log(chalk.red('Sorry, this script requires ms-vscode-remote.remote-ssh extension'));
    process.exit();
}else {
    // found..
    console.log(chalk.green('Requirements found! Proccessing...'));
    cli.run();
}