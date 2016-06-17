var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost/recycled-map',
        rootPath: rootPath,
        port: process.env.PORT || 3030
    },
    production: {
        db: 'mongodb://braedenf:tr0ubl3x2@ds015584.mlab.com:15584/recycled-db',
        rootPath: rootPath,
        port : process.env.PORT || 80
    }
}