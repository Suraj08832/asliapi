// Log environment variables on startup
console.log('Application starting, environment check:', {
    API_KEY_exists: 'API_KEY' in process.env,
    API_KEY_length: process.env.API_KEY ? process.env.API_KEY.length : 0,
    environment: process.env.NODE_ENV,
    railway_env: process.env.RAILWAY_ENVIRONMENT
});

const authenticate = (req, res, next) => {
    const receivedKey = req.headers['x-api-key'];
    const expectedKey = process.env.API_KEY;
    
    // Debug endpoint to check auth configuration
    if (req.path === '/api/debug/auth') {
        return res.json({
            status: 'ok',
            message: 'Auth debug information',
            debug: {
                headers: req.headers,
                apiKeyConfigured: !!process.env.API_KEY,
                apiKeyLength: process.env.API_KEY ? process.env.API_KEY.length : 0,
                receivedKeyLength: receivedKey ? receivedKey.length : 0,
                availableEnvVars: Object.keys(process.env),
                processEnvApiKey: process.env.API_KEY,
                envVarDetails: {
                    API_KEY: {
                        exists: 'API_KEY' in process.env,
                        type: typeof process.env.API_KEY,
                        length: process.env.API_KEY ? process.env.API_KEY.length : 0,
                        isEmpty: process.env.API_KEY === '',
                        isUndefined: process.env.API_KEY === undefined,
                        isNull: process.env.API_KEY === null
                    }
                },
                environment: {
                    NODE_ENV: process.env.NODE_ENV,
                    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
                    RAILWAY_SERVICE_NAME: process.env.RAILWAY_SERVICE_NAME
                }
            }
        });
    }

    // If API key is not configured in environment, allow all requests (for testing)
    if (!expectedKey) {
        console.warn('WARNING: No API key configured, allowing request. Environment check:', {
            nodeEnv: process.env.NODE_ENV,
            railwayEnv: process.env.RAILWAY_ENVIRONMENT,
            availableEnvKeys: Object.keys(process.env)
        });
        return next();
    }

    // Check if API key is missing
    if (!receivedKey) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'API key is missing',
            required_header: 'X-API-Key'
        });
    }

    // Compare keys (case-sensitive, exact match)
    if (receivedKey.trim() !== expectedKey.trim()) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid API key',
            debug: {
                receivedLength: receivedKey.length,
                expectedLength: expectedKey.length,
                match: false
            }
        });
    }

    next();
};

module.exports = authenticate; 