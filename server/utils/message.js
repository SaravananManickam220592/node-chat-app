var generateMessage = function (from, text) {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    }
};

var generateLocationMessage = function(from,latitude,longtitude){
    return {
        from,
        url : `https://www.google.com/maps?q=${latitude},${longtitude}`,
        createdAt : new Date().getTime()
    }
}

module.exports = { generateMessage , generateLocationMessage};