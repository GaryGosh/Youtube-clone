if(process.env.NODE_ENV === 'production') {
    modeule.exports = require('./prod');
} else {
    module.exports = require('./dev');
}