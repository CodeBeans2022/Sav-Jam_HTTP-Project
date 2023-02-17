function message(req, res, next) {
    console.log('This message is coming from middleware! Whoooooa!');
    next();
}

module.exports = {message}