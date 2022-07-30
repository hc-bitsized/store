const env = require('./environment');
const envProd = require('./environment.prod');

let exp = env;

if (process.env.environment) {
    exp = envProd;
}

module.exports = exp;