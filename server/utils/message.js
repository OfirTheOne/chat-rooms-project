const moment = require('moment');


var generateMessage = (from, text) => {
    return {
        from,
        text,
        crearedAt: moment().valueOf()
    };
};

var generateLocationMessage = (from,latitude, longitude) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${latitude},${longitude}`,
        crearedAt: moment().valueOf()
    };
};


module.exports = { 
    generateMessage,
    generateLocationMessage };