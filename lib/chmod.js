var chmodr = require('chmodr');
 
module.exports = (url, mode = 0o777) => {
    return new Promise((resolve, reject) => {
        chmodr(url, mode, (err) => {
            if (err) { return reject(err); }
            resolve();
        });
    });
};