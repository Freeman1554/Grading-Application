const logRequest = (req, res, next) =>{
    const timeStamp = new Date().toISOString();
    console.log(`${timeStamp}- ${req.method}- ${req.url} on req.ip: ${req.ip} from ${req.headers['user-agent']}`);
    next();
}

module.exports = logRequest;