const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: { type: String, ref: 'users' },
    profilePicture: String,
    tasks: [{ type: String, ref: 'tasks' }]
});

const User = mongoose.model('users', usersSchema)

module.exports = User