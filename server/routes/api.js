const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

const pool = require('../database/database');

/*

    USERS

*/

// Get all users
ROUTER.get('/api/users', async (req,res) => {
    const users = await pool.query("SELECT * FROM Users");
    res.json(users);
});

// Get one user

// Create user

// Update user

// Delete user

/*

    TASKS

*/

// Get all tasks
ROUTER.get('/api/tasks', async (req,res) => {
    const tasks = await pool.query("SELECT * FROM Tasks");
    res.json(tasks);
});

// Get one task

// Create task

// Update task

// Delete task

// Get tasks for one user

module.exports = ROUTER;