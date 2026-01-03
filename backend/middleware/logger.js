const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            `${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ` +
            `Status: ${res.statusCode} - Duration: ${duration}ms - ` +
            `IP: ${req.ip} - User-Agent: ${req.get('User-Agent')?.substring(0, 50)}...`
        );
    });

    next();
};

const errorLogger = (error, req, res, next) => {
    console.error('❌ ERROR LOG:');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Method:', req.method);
    console.error('URL:', req.originalUrl);
    console.error('Error Message:', error.message);
    console.error('Stack:', error.stack);
    console.error('-'.repeat(20));

    next(error);
};

export { requestLogger, errorLogger };