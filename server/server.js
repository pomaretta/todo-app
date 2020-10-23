// Modules
const EXPRESS = require('express')

// Init
const SERVER = EXPRESS();
const PORT = {
    DEVELOPMENT: 8000,
    STABLE: 3000
}

// ROUTES
SERVER.use(require('./routes/api'));

// Listen
SERVER.listen(PORT.DEVELOPMENT, console.log(`Server listening on port ${PORT.DEVELOPMENT}`))