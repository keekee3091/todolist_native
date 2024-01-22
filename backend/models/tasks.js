const mongoose = require('mongoose')

const tasksSchema = mongoose.Schema({
    taskName: String,
    taskPriority: Number,
    taskEndDate: Date,
    taskUser: [{ type: String, ref: 'users' }]
})

const Task = mongoose.model('tasks', tasksSchema);

module.exports = Task