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

ROUTER.get('/api/users/:userID', async (req,res) => {
	const { userID } = req.params;
	const user = await pool.query("SELECT * FROM Users WHERE userID = ?", [userID]);
	res.json(user);
});

// Create user
ROUTER.post('/api/users', async (req,res) => {
	try {
		// Password should be encypted before inserting user
		await pool.query('INSERT INTO Users SET ?', [req.body]);
        res.json({status: '200'});
	} catch(err){
		console.log(err);
		res.json({status: '400'});
	}
});

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