const shell = require('shelljs');

module.exports = {
    detect: () => shell.which('code'),
    detectRemoteExtension: () => {
        var list_ex = shell.exec('code --list-extensions', {silent: true});
        return list_ex.stdout.split("\n").indexOf("ms-vscode-remote.remote-ssh") !== -1;
    }
}