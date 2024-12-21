
const jsonValidator = (error, req, res, next) => {
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
        res.status(400).send({ error: 'Invalid JSON' });
    } else {
        next();
    }
}

module.exports = jsonValidator;