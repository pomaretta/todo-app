// Modules
const MYSQL = require('mysql');
const { promisify } = require('util');

const CREDENTIALS = require('./keys');

// Pool
const pool = MYSQL.createPool(CREDENTIALS);

// Get connection
pool.getConnection((err,connection) => {
    if(err){throw err}; // If theres an error in the attemp to connect it throws up.
    console.log('Connection succesfully!');
});

// Set promisify
pool.query = promisify(pool.query);

module.exports = pool;