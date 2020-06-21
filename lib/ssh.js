const Client = require('ssh2').Client;

class ssh {

    constructor({ host, port, username, privateKey, password }){
        this.host = host;
        this.port = port;
        this.username = username;
        this.privateKey = privateKey;
        this.password = password;
        this.client = null;
        this.sftpClient = null;
    }
    async connection () {
        const self = this;
        return new Promise((resolve, reject) => {
            if (!self.client) {
                self.client = new Client();
                self.client.on('error', (e) => {
                    self.client = null;
                    self.sftpClient = null;
                    reject(e);
                });
                self.client.on('close', (e) => {
                    self.client = null;
                    self.sftpClient = null;
                });
                self.client.on('ready', function() {
                    resolve();
                });
                self.client.connect({
                    host: self.host, 
                    port: self.port, 
                    username: self.username, 
                    privateKey: self.privateKey, 
                    password: self.password
                });
            }else {
                resolve();
            }
        });
    }
    
    async execTrim(cmd) {
        return this.exec(cmd).then((response) => response.trim());
    }

    async exec (cmd) {
        const self = this;
        return this.connection().then(() => {
            return new Promise((resolve, reject) => {
                self.client.exec(cmd, function(err, stream) {
                    if (err) { reject(err); return; }
                    let stdout = '';
                    let stderr = '';
                    stream.on('close', function(code, signal) {
                        if (stderr.length === 0) {
                            resolve(stdout);
                        }else {
                            reject(stderr);
                        }
                    }).on('data', function(data) {
                        stdout += data;
                    }).stderr.on('data', function(data) {
                        stderr += data;
                    });
                });
            });
        })
    }

    async test () {
        return this.connection().then(() => Promise.resolve(true)).catch(e => Promise.resolve(false))
    }

    async close() {
        const self = this;
        if (!self.client) {
            return Promise.resolve(true);
        }
        return this.connection().then(() => new Promise((resolve) => {
            self.client.on('close', () => {
                resolve(true);
            })
            self.client.end();
        })).catch(e => Promise.resolve(false))
    }

    async sftp() {
        const self = this;
        return this.connection().then(() => 
            new Promise((resolve, reject) => {
                self.client.sftp(function(err, sftp) {
                    if (err) return reject(err);
                    self.sftpClient = sftp;
                    resolve();
                });
            })
        );
    }

    async uploadContent(filename, content) {
        const self = this;
        return this.sftp().then(() => {
            return new Promise((resolve, reject) => {
                var writeStream = self.sftpClient.createWriteStream( filename );
                writeStream.on('error', reject);
                writeStream.on('finish', resolve);
                writeStream.write(content, function() {
                    writeStream.end();
                });
            });
        });
    }
}

module.exports = ssh;