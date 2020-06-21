const shell = require('shelljs');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const pressAnyKey = require('press-any-key');

const cli = require('./lib/cli');
const vscode = require('./lib/vscode');
const ssh_gen = require('./lib/ssh-gen');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('VSCode SSH Utils', { horizontalLayout: 'full' })
  )
);

const anyKeyToExit = async () => {
  try {
    await pressAnyKey("Press any key to exit...", {
      ctrlC: "reject"
    });
  }
  finally {
    process.exit();
  }
};

(async function(){
  if (!vscode.detect() || !ssh_gen.detect()) {
      console.log(chalk.red('Sorry, this script requires vscode and ssh-keygen'));
      await anyKeyToExit();
  }

  if (!vscode.detectRemoteExtension()) {
      // not found
      // install command: code --install-extension ms-vscode-remote.remote-ssh
      // TODO: install
      console.log(chalk.red('Sorry, this script requires ms-vscode-remote.remote-ssh extension'));
      await anyKeyToExit();
  }else {
      // found..
      console.log(chalk.green('Requirements found! Proccessing...'));
      await cli.run();
      await anyKeyToExit();
  }
})();