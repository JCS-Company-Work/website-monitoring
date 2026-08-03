// Pull in API key from environment variables
const API_KEY = process.env.API_KEY;

/**
 * Validates requests from trusted clients.
 */
function authenticate(req, res, next) {

    const key = req.headers['x-api-key'];

    if (!key || key !== API_KEY) {

        return res.status(401).json({
            success: false,
            message: 'Unauthorised'
        });

    }

    next();

}

module.exports = {
    authenticate
};